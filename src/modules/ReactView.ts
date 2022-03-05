import * as vscode from 'vscode';

export default class ReactViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private nounce = Date.now();

  constructor(
    private readonly _extensionUri: vscode.Uri,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly webViewApi: Record<string, (data: any) => void>) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: vscode.WebviewViewResolveContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    this.reload();

    webviewView.webview.onDidReceiveMessage((msg: { event: string, data: unknown }) => {
      if (msg.event === 'reload') {
        this.reload();
      } else {
        this.webViewApi[msg.event](msg.data);
      }
    });
  }

  public send(msg: { event: string, data: unknown }) {
    this.view?.webview.postMessage(msg);
  }

  public reload() {
    if (this.view) {
      this.nounce = Date.now();
      this.view.webview.html = this.getHtml();
    }
  }

  private getHtml(): string {
    const webview = this.view!.webview;
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.js'));

    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.css'));
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
    );

    return `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this.nounce}</title>
            <link href="${codiconsUri}" rel="stylesheet" />
            <link href="${styleResetUri}" rel="stylesheet">
        </head>
        <body>
            <div id="root"></div>
            <script src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}