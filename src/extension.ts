import * as vscode from 'vscode';
import { Chain } from './chain';
import RemixViewProvider from './remix-view/RemixView';

export function activate(context: vscode.ExtensionContext) {
  const out = vscode.window.createOutputChannel('Remix-Light');

  // TODO: use environments
  vscode.commands.executeCommand('setContext', 'remix-light.debug', true);

  (async () => {

    const chain = await Chain.spinup();

    const resources = new Proxy({}, {
      set(target: { [key: string]: unknown }, prop: string, value: unknown) {
        target[prop] = value;
        remixViewProvider?.send({ event: 'resourceUpdate', data: { resource: prop, data: value } });
        return true;
      }
    });

    // set defaults
    Object.entries({
      useCompiler: true,
      autoCompile: false,
      compilerVersion: 'Version1',
      compiledContracts: {}
    }).map(v => resources[v[0]] = v[1]);

    let solFiles: vscode.Uri[] = [];
    // TODO: more performant use deltas
    const updateSolFiles = async () => {
      solFiles = (await vscode.workspace.findFiles('**/*.sol'));
      resources['contracts'] = solFiles.map(uri => uri.path);
    };
    vscode.workspace.onDidDeleteFiles(updateSolFiles);
    vscode.workspace.onDidCreateFiles(updateSolFiles);
    vscode.workspace.onDidRenameFiles(updateSolFiles);
    updateSolFiles();

    const setOpenedContract = (e: vscode.TextEditor | undefined) => {
      if (e?.document.uri.fsPath.endsWith('.sol')) {
        resources['openedContract'] = e.document.uri.path;
      }
    };
    vscode.window.onDidChangeActiveTextEditor(setOpenedContract);
    setOpenedContract(vscode.window.activeTextEditor);

    const compileContract = (file: vscode.Uri) => {
      resources.compiledContracts = {...resources.compiledContracts as object, [file.path]: true };
    };

    vscode.workspace.onDidSaveTextDocument(e => {
      if (e.uri.fsPath.endsWith('.sol') && resources.autoCompile) {
        compileContract(e.uri);
      }
    });

    const remixViewProvider = new RemixViewProvider(context.extensionUri, {
      log: (line: string) => {
        out.appendLine(line);
      },
      subscribeToResource: async (resource: string) => {
        let data;
        switch (resource) {
        case 'accounts':
          data = await chain.web3.eth.getAccounts();
          break;
        }
        if (data !== undefined) {
          resources[resource] = data;
        } else {
          resources[resource] = resources[resource];
        }
      },
      setResource: (msg: { resource: string, data: unknown }) => {
        switch (msg.resource) {
        case 'autoCompile':
          if (msg.data) {
            for (const file of solFiles) {
              compileContract(file);
            }
          }
          break;
        }
        resources[msg.resource] = msg.data;
      },
      setActiveContract: async (contract: string) => {
        const file = solFiles.find(f => f.path.includes(contract));
        if (file) {
          await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(file));
        }
      }
    });

    context.subscriptions.push(vscode.commands.registerCommand('remix-light.reload', () => {
      remixViewProvider.reload();
    }));

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider));

  })();
}
