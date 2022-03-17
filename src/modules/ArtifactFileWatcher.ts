import { Subject } from 'rxjs';
import * as vscode from 'vscode';

export default class ArtifactFileWatcher {
  private artifactLoadedSub;
  public $artifactLoaded;

  constructor(private config: vscode.WorkspaceConfiguration, private context: vscode.ExtensionContext) {
    this.artifactLoadedSub = new Subject<vscode.Uri>();
    this.$artifactLoaded = this.artifactLoadedSub.asObservable();
  }

  public async watch() {
    // find all artifacts
    const glob = this.config.get<string>('artifactGlobPattern');
    if (!glob) return;

    const files = (await vscode.workspace.findFiles(glob));
    for (const file of files) {
      this.loadArtifact(file);
    }

    const fsw = vscode.workspace.createFileSystemWatcher(glob);
    this.context.subscriptions.push(fsw);

    const cb = this.loadArtifact.bind(this);
    fsw.onDidChange(cb);
    fsw.onDidCreate(cb);

    // We don't care about deletions
    // fsw.onDidDelete();
  }

  public async loadArtifact(file: vscode.Uri) {
    this.artifactLoadedSub.next(file);
  }

}