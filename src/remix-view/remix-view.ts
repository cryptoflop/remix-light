import * as vscode from 'vscode';

export default class RemixViewProvider implements vscode.WebviewViewProvider {

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: vscode.WebviewViewResolveContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.event) {
      case 'reload':
      {
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        break;
      }
      }
    });
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: 'addColor' });
    }
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'clearColors' });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.js'));

    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.css')
    );

    const time = Date.now();
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${time}</title>
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