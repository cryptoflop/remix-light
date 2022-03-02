"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var RemixViewProvider = /** @class */ (function () {
    function RemixViewProvider(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    RemixViewProvider.prototype.resolveWebviewView = function (webviewView, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token) {
        var _this = this;
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        if (!webviewView.webview.html) {
            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        }
        webviewView.webview.onDidReceiveMessage(function (data) {
            switch (data.event) {
                case 'reload':
                    {
                        webviewView.webview.html = _this._getHtmlForWebview(webviewView.webview);
                        break;
                    }
            }
        });
    };
    RemixViewProvider.prototype.addColor = function () {
        var _a, _b;
        if (this._view) {
            (_b = (_a = this._view).show) === null || _b === void 0 ? void 0 : _b.call(_a, true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage({ type: 'addColor' });
        }
    };
    RemixViewProvider.prototype.clearColors = function () {
        if (this._view) {
            this._view.webview.postMessage({ type: 'clearColors' });
        }
    };
    RemixViewProvider.prototype._getHtmlForWebview = function (webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        var scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.js'));
        var styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.css'));
        var codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
        // use date now to reload
        var time = Date.now();
        return "<!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n          <meta charset=\"UTF-8\">\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n          <title>".concat(time, "</title>\n          <link href=\"").concat(codiconsUri, "\" rel=\"stylesheet\" />\n          <link href=\"").concat(styleResetUri, "\" rel=\"stylesheet\">\n      </head>\n      <body>\n          <div id=\"root\"></div>\n          <script src=\"").concat(scriptUri, "\"></script>\n      </body>\n      </html>\n      ");
    };
    return RemixViewProvider;
}());
exports["default"] = RemixViewProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtaXhWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlbWl4LXZpZXcvUmVtaXhWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDO0lBSUUsMkJBQTZCLGFBQXlCO1FBQXpCLGtCQUFhLEdBQWIsYUFBYSxDQUFZO0lBQUksQ0FBQztJQUVwRCw4Q0FBa0IsR0FBekIsVUFDRSxXQUErQjtJQUMvQiw2REFBNkQ7SUFDN0QsT0FBeUM7SUFDekMsNkRBQTZEO0lBQzdELE1BQWdDO1FBTGxDLGlCQStCQztRQXhCQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztRQUV6QixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRztZQUM1QiwrQkFBK0I7WUFDL0IsYUFBYSxFQUFFLElBQUk7WUFFbkIsa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxhQUFhO2FBQ25CO1NBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUM3QixXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFBLElBQUk7WUFDMUMsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNwQixLQUFLLFFBQVE7b0JBQ2I7d0JBQ0UsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDeEUsTUFBTTtxQkFDUDthQUNBO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sb0NBQVEsR0FBZjs7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFBLE1BQUEsSUFBSSxDQUFDLEtBQUssRUFBQyxJQUFJLG1EQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsNkRBQTZEO1lBQ3RGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQ3REO0lBQ0gsQ0FBQztJQUVNLHVDQUFXLEdBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0lBRU8sOENBQWtCLEdBQTFCLFVBQTJCLE9BQXVCO1FBQ2hELDRHQUE0RztRQUM1RyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRWxILElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FDM0UsQ0FBQztRQUNGLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FDbkcsQ0FBQztRQUVGLHlCQUF5QjtRQUN6QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsT0FBTyw4TUFLUSxJQUFJLDhDQUNDLFdBQVcsOERBQ1gsYUFBYSw2SEFJWixTQUFTLHVEQUczQixDQUFDO0lBQ04sQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQWpGRCxJQWlGQyJ9