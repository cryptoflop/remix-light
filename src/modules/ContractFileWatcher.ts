import { BehaviorSubject, Subject } from 'rxjs';
import * as vscode from 'vscode';

export default class ContractFileWatcher {
  private contractSavedSub;
  public $contractSaved;

  private contractOpenedSub;
  public $contractOpened;

  private filesSub;
  public $files;

  constructor(private config: vscode.WorkspaceConfiguration, private context: vscode.ExtensionContext) {
    this.filesSub = new BehaviorSubject<Record<string, vscode.Uri>>({});
    this.$files = this.filesSub.asObservable();

    this.contractOpenedSub = new Subject<vscode.Uri>();
    this.$contractOpened = this.contractOpenedSub.asObservable();

    this.contractSavedSub = new Subject<vscode.Uri>();
    this.$contractSaved = this.contractSavedSub.asObservable();
  }

  public async watch() {
    const glob = this.config.get<string>('contractGlobPattern');
    if (!glob) return;

    const setOpenedContract = (e: vscode.TextEditor | undefined) => {
      if (e?.document.uri.fsPath.endsWith('.sol')) {
        this.contractOpenedSub.next(e.document.uri);
      }
    };
    vscode.window.onDidChangeActiveTextEditor(setOpenedContract);
    setOpenedContract(vscode.window.activeTextEditor);

    const files = (await vscode.workspace.findFiles(glob));
    const filesMap = {...this.filesSub.value};
    for (const file of files) {
      filesMap[file.path] = file;
    }
    this.filesSub.next(filesMap);

    const fsw = vscode.workspace.createFileSystemWatcher(glob);
    this.context.subscriptions.push(fsw);

    fsw.onDidCreate(file => {
      const filesMap = {...this.filesSub.value};
      filesMap[file.path] = file;
      this.filesSub.next(filesMap);
      this.contractSavedSub.next(file);
    });
    fsw.onDidDelete(file => {
      const filesMap = {...this.filesSub.value};
      delete filesMap[file.path];
      this.filesSub.next(filesMap);
    });

    fsw.onDidChange(file => {
      this.contractSavedSub.next(file);
    });
  }
}