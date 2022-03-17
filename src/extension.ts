import * as vscode from 'vscode';
import ArtifactFileWatcher from './modules/ArtifactFileWatcher';
import { Chain } from './modules/Chain';

import Compiler from './modules/Compiler';
import ContractDeployer from './modules/ContractDeployer';
import ContractFileWatcher from './modules/ContractFileWatcher';
import ReactViewProvider from './modules/ReactView';
import createResources from './modules/Resources';

declare let DEBUG: boolean;

function clearArrayPrototype() {
  // This looks awful and it is, but hear me out...
  // You should never touch prototype properties but unfortunately, some libaries do.
  // One example of such a library is mscorelib.
  // I developed this extension to work in symbiosis with the Solidity extension (https://github.com/juanfranblanco/vscode-solidity)
  // Some library the Solidity extension uses, requires mscorelib...
  // The remix-simulator library I need, uses the for in syntax with arrays (wich you shouldn't do as well)
  // If you add 1+1 you can see why this is a problem.
  // This is why I decided to clear the Array.prototype from the properties added by mscorelib
  // in order to use my librarys without errors.
  // Maybe there will be subsequent errors I haven't encountered yet, but right now it seems like this fixes it.
  for (const k in []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (Array.prototype as any)[k];
  }
}

export function activate(context: vscode.ExtensionContext) {
  clearArrayPrototype(); // 🙄

  const out = vscode.window.createOutputChannel('Remix-Light');

  // TODO: use environments
  vscode.commands.executeCommand('setContext', 'remix-light.debug', DEBUG);

  const config = vscode.workspace.getConfiguration('remix-light');

  const [resources, resourcesApi, $resourceSet, subscribableResources, $resourceSetOnObj] = createResources();

  // set defaults / use configs
  Object.entries({
    useCompiler: config.get('useCompiler'),
    autoCompile: config.get('autoCompile')
  }).map(v => resources[v[0]] = v[1]);

  const chain = new Chain(resources);
  chain.registerResources(subscribableResources);

  const contractFileWatcher = new ContractFileWatcher(config, context);
  const artifactFileWatcher = new ArtifactFileWatcher(config, context);

  const compiler = new Compiler(resources, contractFileWatcher, out);
  compiler.subscribeResources($resourceSet);

  const deployer = new ContractDeployer(chain, resources, out, compiler, artifactFileWatcher);

  contractFileWatcher.watch();
  artifactFileWatcher.watch();

  const remixViewProvider = new ReactViewProvider(context.extensionUri, {
    log: (line: string) => {
      out.appendLine(line);
    },

    ...resourcesApi,
    ...compiler.api,
    ...deployer.api
  }, $resourceSetOnObj);

  context.subscriptions.push(vscode.commands.registerCommand('remix-light.reload', () => {
    remixViewProvider.reload();
  }));

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider)
  );
}
