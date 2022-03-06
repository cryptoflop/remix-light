import * as vscode from 'vscode';
import { Chain } from './modules/Chain';

import Compiler from './modules/Compiler';
import ContractDeployer from './modules/ContractDeployer';
import ContractFileWatcher from './modules/ContractFileWatcher';
import ReactViewProvider from './modules/ReactView';
import createResources from './modules/Resources';

export function activate(context: vscode.ExtensionContext) {
  const out = vscode.window.createOutputChannel('Remix-Light');

  // TODO: use environments
  vscode.commands.executeCommand('setContext', 'remix-light.debug', true);

  const config = vscode.workspace.getConfiguration('remix-light');

  const [resources, resourcesApi, $resourceSet, subscribableResources, $resourceSetOnObj] = createResources();

  // set defaults / use configs
  Object.entries({
    useCompiler: config.get('useCompiler'),
    autoCompile: config.get('autoCompile')
  }).map(v => resources[v[0]] = v[1]);

  const chain = new Chain(resources);
  chain.registerResources(subscribableResources);

  const contractFileWatcher = new ContractFileWatcher(resources);
  contractFileWatcher.subscribeResources($resourceSet);

  const deployer = new ContractDeployer(chain, resources, contractFileWatcher);

  const compiler = new Compiler(resources, contractFileWatcher);
  compiler.subscribeResources($resourceSet);

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