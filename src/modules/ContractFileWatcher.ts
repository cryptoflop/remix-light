import { Subject } from 'rxjs';
import * as vscode from 'vscode';
import type { Resources } from './Resources';

export default class ContractFileWatcher {
  public files: vscode.Uri[] = [];

  public api;

  public $onContractSaved;

  constructor(resources: Resources) {
    // TODO: more performant use deltas
    const updateSolFiles = async () => {
      this.files = (await vscode.workspace.findFiles('**/*.sol'));
      resources['contracts'] = this.files.map(uri => uri.path);
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

    const onContractSavedSub = new Subject<vscode.Uri>();
    this.$onContractSaved = onContractSavedSub.asObservable();

    vscode.workspace.onDidSaveTextDocument(e => {
      if (e.uri.fsPath.endsWith('.sol') && resources.autoCompile) {
        onContractSavedSub.next(e.uri);
      }
    });

    this.api = {
      setActiveContract: async (contract: string) => {
        const file = this.files.find(f => f.path.includes(contract));
        if (file) {
          await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(file));
        }
      }
    };
  }

}