"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var RemixViewProvider = /** @class */ (function () {
    function RemixViewProvider(_extensionUri, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webViewApi) {
        this._extensionUri = _extensionUri;
        this.webViewApi = webViewApi;
        this.nounce = Date.now();
    }
    RemixViewProvider.prototype.resolveWebviewView = function (webviewView, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token) {
        var _this = this;
        this.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        this.reload();
        webviewView.webview.onDidReceiveMessage(function (msg) {
            if (msg.event === 'reload') {
                _this.reload();
            }
            else {
                _this.webViewApi[msg.event](msg.data);
            }
        });
    };
    RemixViewProvider.prototype.send = function (msg) {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.webview.postMessage(msg);
    };
    RemixViewProvider.prototype.reload = function () {
        if (this.view) {
            this.nounce = Date.now();
            this.view.webview.html = this.getHtml();
        }
    };
    RemixViewProvider.prototype.getHtml = function () {
        var webview = this.view.webview;
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        var scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.js'));
        var styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'remix-view', 'index.css'));
        var codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
        return "<!DOCTYPE html>\n      <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>".concat(this.nounce, "</title>\n            <link href=\"").concat(codiconsUri, "\" rel=\"stylesheet\" />\n            <link href=\"").concat(styleResetUri, "\" rel=\"stylesheet\">\n        </head>\n        <body>\n            <div id=\"root\"></div>\n            <script src=\"").concat(scriptUri, "\"></script>\n        </body>\n      </html>\n    ");
    };
    return RemixViewProvider;
}());
exports["default"] = RemixViewProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtaXhWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlbWl4LXZpZXcvUmVtaXhWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDO0lBTUUsMkJBQ21CLGFBQXlCO0lBQzFDLDhEQUE4RDtJQUM3QyxVQUErQztRQUYvQyxrQkFBYSxHQUFiLGFBQWEsQ0FBWTtRQUV6QixlQUFVLEdBQVYsVUFBVSxDQUFxQztRQUwxRCxXQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBSzBDLENBQUM7SUFFaEUsOENBQWtCLEdBQXpCLFVBQ0UsV0FBK0I7SUFDL0IsNkRBQTZEO0lBQzdELE9BQXlDO0lBQ3pDLDZEQUE2RDtJQUM3RCxNQUFnQztRQUxsQyxpQkEwQkM7UUFuQkMsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7UUFFeEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUc7WUFDNUIsYUFBYSxFQUFFLElBQUk7WUFFbkIsa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxhQUFhO2FBQ25CO1NBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLFdBQVcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBQyxHQUFxQztZQUM1RSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUMxQixLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxLQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxnQ0FBSSxHQUFYLFVBQVksR0FBcUM7O1FBQy9DLE1BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sa0NBQU0sR0FBYjtRQUNFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRU8sbUNBQU8sR0FBZjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFLLENBQUMsT0FBTyxDQUFDO1FBQ25DLDRHQUE0RztRQUM1RyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRWxILElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FDM0UsQ0FBQztRQUNGLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FDbkcsQ0FBQztRQUVGLE9BQU8sc05BS1UsSUFBSSxDQUFDLE1BQU0sZ0RBQ04sV0FBVyxnRUFDWCxhQUFhLHFJQUlaLFNBQVMsdURBRy9CLENBQUM7SUFDSixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBOUVELElBOEVDIn0=