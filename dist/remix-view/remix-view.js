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
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
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
        var time = Date.now();
        return "<!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n          <meta charset=\"UTF-8\">\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n          <title>".concat(time, "</title>\n          <link href=\"").concat(styleResetUri, "\" rel=\"stylesheet\">\n      </head>\n      <body>\n          <div id=\"root\"></div>\n          <script src=\"").concat(scriptUri, "\"></script>\n      </body>\n      </html>\n      ");
    };
    return RemixViewProvider;
}());
exports["default"] = RemixViewProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtaXgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1peC12aWV3L3JlbWl4LXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakM7SUFJRSwyQkFBNkIsYUFBeUI7UUFBekIsa0JBQWEsR0FBYixhQUFhLENBQVk7SUFBSSxDQUFDO0lBRXBELDhDQUFrQixHQUF6QixVQUNFLFdBQStCO0lBQy9CLDZEQUE2RDtJQUM3RCxPQUF5QztJQUN6Qyw2REFBNkQ7SUFDN0QsTUFBZ0M7UUFMbEMsaUJBNkJDO1FBdEJDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBRXpCLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHO1lBQzVCLCtCQUErQjtZQUMvQixhQUFhLEVBQUUsSUFBSTtZQUVuQixrQkFBa0IsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLGFBQWE7YUFDbkI7U0FDRixDQUFDO1FBRUYsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RSxXQUFXLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQUEsSUFBSTtZQUMxQyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLEtBQUssUUFBUTtvQkFDYjt3QkFDRSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN4RSxNQUFNO3FCQUNQO2FBQ0E7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxvQ0FBUSxHQUFmOztRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQUEsTUFBQSxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksbURBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyw2REFBNkQ7WUFDdEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBRU0sdUNBQVcsR0FBbEI7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUM7SUFFTyw4Q0FBa0IsR0FBMUIsVUFBMkIsT0FBdUI7UUFDaEQsNEdBQTRHO1FBQzVHLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFbEgsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUMzRSxDQUFDO1FBRUYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sOE1BS1EsSUFBSSw4Q0FDQyxhQUFhLDZIQUlaLFNBQVMsdURBRzNCLENBQUM7SUFDTixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBMUVELElBMEVDIn0=