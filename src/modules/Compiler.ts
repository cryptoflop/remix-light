import { first } from 'rxjs';
import * as vscode from 'vscode';
import type ContractFileWatcher from './ContractFileWatcher';
import type { Resources, ResourceSetObservable } from './Resources';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const solc = require('solc');

export interface CompiledContract {
  id: string;
  name: string;
  abi: {
		name: string;
		inputs: { type: string, name: string }[];
		outputs: { type: string	}[];
		stateMutability: string;
		type: string;
	}[];
  bytecode: string;
}

export default class Compiler {
  public api;

  public files: vscode.Uri[] = [];

  public openedContract: vscode.Uri | undefined;

  constructor(private resources: Resources, public cfw: ContractFileWatcher, private out: vscode.OutputChannel) {
    let contractFilesMap: Record<string, vscode.Uri> = {};
    cfw.$files.subscribe(files => {
      contractFilesMap = files;
    });

    cfw.$contractOpened.subscribe(file => {
      if (contractFilesMap[file.path]) {
        this.openedContract = file;
        resources.openedContract = file.path;
      }
    });

    cfw.$contractSaved.subscribe(file => {
      if (resources.autoCompile) {
        this.compile(file);
      }
    });

    cfw.$files.subscribe(files => {
      if (this.openedContract) {
        if (!files[this.openedContract.path]) {
          this.openedContract = undefined;
          resources.openedContract = undefined;
        }
      } else {
        const openEditorFile = vscode.window.activeTextEditor?.document.uri;
        if (files[openEditorFile?.path || '']) {
          this.openedContract = openEditorFile;
          resources.openedContract = openEditorFile?.path;
        }
      }
      this.files = Object.values(files);
      resources.contracts = this.files.map(uri => uri.path);
    });

    if (resources.autoCompile) {
      cfw.$files.pipe(first()).subscribe(() => this.compileAll());
    }

    this.api = {
      compile: () => {
        if (this.openedContract) {
          this.compile(this.openedContract).then(success => {
            if (!success) {
              out.show();
            }
          });
        }
      }
    };
  }

  subscribeResources($resourceSet: ResourceSetObservable) {
    $resourceSet.subscribe(msg => {
      switch (msg.resource) {
      case 'useCompiler':
        // do we have to do something here?
        break;
      case 'autoCompile':
        if (msg.data) {
          this.compileAll();
        }
        break;
      case 'openedContract': {
        const file = this.pathToUri(msg.data as string);
        if (file) {
          this.openedContract = file;
          // open file in vscode
          vscode.workspace.openTextDocument(file).then(td => vscode.window.showTextDocument(td));
        }
        break;
      }}
    });
  }

  private findImports(path: string) {
    if (path === 'lib.sol')
      return {
        contents:
          'library L { function f() internal returns (uint) { return 7; } }'
      };
    else return { error: 'File not found' };
  }

  public pathToUri(path: string) {
    return  this.files.find(f => f.path.includes(path));
  }

  public compileAll() {
    for (const file of this.files) {
      this.compile(file);
    }
  }

  public async compile(file: vscode.Uri) {
    if (!this.resources.useCompiler) return true;

    const input = {
      language: 'Solidity',
      sources: {
        [file.path]: {
          content: (await vscode.workspace.openTextDocument(file)).getText()
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };

    const splits = file.path.split('/');
    const shortPath = splits[splits.length - 2] + '/' + splits[splits.length - 1];

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: this.findImports }));

    if (output.errors) {
      for (const e of output.errors) {
        this.out.appendLine(e.formattedMessage);
      }
      return false;
    } else {
      this.out.appendLine(`Successfully compiled: ${file.path} \n`);
    }

    if (!output.contracts) { return true; }

    const compiledContracts: Record<string, CompiledContract> = {};
    Object.entries(output.contracts[file.path])
      .map(e => {
        const compilationResult = e[1] as { abi: CompiledContract['abi'], evm: { bytecode: { object: string } } };
        return { name: e[0], abi: compilationResult.abi, bytecode: compilationResult.evm.bytecode.object };
      })
      .forEach(compiledContract => {
        const id = file.path + '/' + compiledContract.name;
        compiledContracts[id] = { ...compiledContract, name: compiledContract.name + ' - ' + shortPath, id };
      });

    this.resources.compiledContracts = {
      ...this.resources.compiledContracts as object,
      ...compiledContracts
    };

    return true;
  }

}