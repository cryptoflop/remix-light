import { Subject } from 'rxjs';
import * as vscode from 'vscode';
import type { Resources, ResourceSetObservable } from './Resources';

export default class ContractFileWatcher {
  public files: vscode.Uri[] = [];

  public $contractSaved;

  public $filesLoaded;

  public get openedContract() {
    return this.pathToUri(this.resources.openedContract as string);
  }

  constructor(private resources: Resources) {
    const filesLoadedSub = new Subject();
    this.$filesLoaded = filesLoadedSub.asObservable();

    // TODO: more performant use deltas
    const updateSolFiles = async () => {
      this.files = (await vscode.workspace.findFiles('**/*.sol'));
      resources.contracts = this.files.map(uri => uri.path);
      filesLoadedSub.next(null);
    };
    vscode.workspace.onDidDeleteFiles(updateSolFiles);
    vscode.workspace.onDidCreateFiles(updateSolFiles);
    vscode.workspace.onDidRenameFiles(updateSolFiles);
    updateSolFiles();

    const setOpenedContract = (e: vscode.TextEditor | undefined) => {
      if (e?.document.uri.fsPath.endsWith('.sol')) {
        resources.openedContract = e.document.uri.path;
      }
    };
    vscode.window.onDidChangeActiveTextEditor(setOpenedContract);
    setOpenedContract(vscode.window.activeTextEditor);

    const onContractSavedSub = new Subject<vscode.Uri>();
    this.$contractSaved = onContractSavedSub.asObservable();

    vscode.workspace.onDidSaveTextDocument(e => {
      if (e.uri.fsPath.endsWith('.sol') && resources.autoCompile) {
        onContractSavedSub.next(e.uri);
      }
    });
  }

  subscribeResources($resourceSet: ResourceSetObservable) {
    $resourceSet.subscribe(msg => {
      switch (msg.resource) {
      case 'openedContract':
        this.setOpenedContract(msg.data as string);
        break;
      }
    });
  }

  private async setOpenedContract(contract: string) {
    const file = this.files.find(f => f.path.includes(contract));
    if (file) {
      await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(file));
    }
  }

  private pathToUri(path: string) {
    return this.files.find(f => f.path.includes(path));
  }

}