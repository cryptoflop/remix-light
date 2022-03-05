import * as vscode from 'vscode';
import { Chain } from './modules/Chain';

import Compiler from './modules/Compiler';
import ContractFileWatcher from './modules/ContractFileWatcher';
import ReactViewProvider from './modules/ReactView';
import createResources from './modules/Resources';

export function activate(context: vscode.ExtensionContext) {
  const out = vscode.window.createOutputChannel('Remix-Light');

  // TODO: use environments
  vscode.commands.executeCommand('setContext', 'remix-light.debug', true);

  const config = vscode.workspace.getConfiguration('remix-light');

  const [resources, resourcesApi, $resourceSet, subscribableResources] = createResources((prop, value) => {
    remixViewProvider?.send({ event: 'resourceUpdate', data: { resource: prop, data: value } });
  });

  const chain = new Chain();
  chain.registerResources(subscribableResources);

  const contractFileWatcher = new ContractFileWatcher(resources);

  const compiler = new Compiler(resources, contractFileWatcher);
  compiler.subscribeResources($resourceSet);

  // set defaults / use configs
  Object.entries({
    useCompiler: config.get('useCompiler'),
    autoCompile: config.get('autoCompile'),
    compiledContracts: {}
  }).map(v => resources[v[0]] = v[1]);

  const remixViewProvider = new ReactViewProvider(context.extensionUri, {
    log: (line: string) => {
      out.appendLine(line);
    },

    ...resourcesApi,
    // TODO: handle this with resources
    ...contractFileWatcher.api
  });

  context.subscriptions.push(vscode.commands.registerCommand('remix-light.reload', () => {
    remixViewProvider.reload();
  }));

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider)
  );
}