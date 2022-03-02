// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import RemixViewProvider from './remix-view/remix-view';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const out = vscode.window.createOutputChannel('Remix-Light');

  const remixViewProvider = new RemixViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider));

}

