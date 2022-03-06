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

  constructor(private resources: Resources, public cfw: ContractFileWatcher) {
    this.api = {
      compile: () => {
        const opendContract = cfw.openedContract;
        if (opendContract) {
          this.compile(opendContract);
        }
      }
    };

    cfw.$contractSaved.subscribe(file => {
      this.compile(file);
    });

    if (resources.autoCompile && resources.useCompiler) {
      cfw.$filesLoaded.pipe(first()).subscribe(() => this.compileAll());
    }
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
      }
    });
  }

  compileAll() {
    for (const file of this.cfw.files) {
      this.compile(file);
    }
  }

  private findImports(path: string) {
    if (path === 'lib.sol')
      return {
        contents:
          'library L { function f() internal returns (uint) { return 7; } }'
      };
    else return { error: 'File not found' };
  }

  async compile(file: vscode.Uri) {
    if (!this.resources.useCompiler) return;

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
  }

}