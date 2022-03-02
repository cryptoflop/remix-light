"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var RemixViewProvider = /** @class */ (function () {
    function RemixViewProvider(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    RemixViewProvider.prototype.resolveWebviewView = function (webviewView, context, _token) {
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
            var _a;
            switch (data.type) {
                case 'colorSelected':
                    {
                        (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.insertSnippet(new vscode.SnippetString("#".concat(data.value)));
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
        var scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        // Do the same for the stylesheet.
        var styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        var styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        var styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        // Use a nonce to only allow a specific script to be run.
        var nonce = getNonce();
        return "<!DOCTYPE html>\n\t\t\t<html lang=\"en\">\n\t\t\t<head>\n\t\t\t\t<meta charset=\"UTF-8\">\n\t\t\t\t<!--\n\t\t\t\t\tUse a content security policy to only allow loading images \n          from https or from our extension directory, and only allow scripts that have a specific nonce.\n\t\t\t\t-->\n\t\t\t\t<meta http-equiv=\"Content-Security-Policy\" \n              content=\"default-src 'none'; style-src ".concat(webview.cspSource, "; script-src 'nonce-").concat(nonce, "';\">\n\t\t\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t\t\t\t<link href=\"").concat(styleResetUri, "\" rel=\"stylesheet\">\n\t\t\t\t<link href=\"").concat(styleVSCodeUri, "\" rel=\"stylesheet\">\n\t\t\t\t<link href=\"").concat(styleMainUri, "\" rel=\"stylesheet\">\n\t\t\t\t\n\t\t\t\t<title>Cat Colors</title>\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t<ul class=\"color-list\">\n\t\t\t\t</ul>\n\t\t\t\t<button class=\"add-color-button\">Add Color</button>\n\t\t\t\t<script nonce=\"").concat(nonce, "\" src=\"").concat(scriptUri, "\"></script>\n\t\t\t</body>\n\t\t\t</html>");
    };
    return RemixViewProvider;
}());
exports["default"] = RemixViewProvider;
function getNonce() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtaXgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZW1peC12aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDO0lBSUUsMkJBQTZCLGFBQXlCO1FBQXpCLGtCQUFhLEdBQWIsYUFBYSxDQUFZO0lBQUksQ0FBQztJQUVwRCw4Q0FBa0IsR0FBekIsVUFDRSxXQUErQixFQUMvQixPQUF5QyxFQUN6QyxNQUFnQztRQUVoQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztRQUV6QixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRztZQUM1QiwrQkFBK0I7WUFDL0IsYUFBYSxFQUFFLElBQUk7WUFFbkIsa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxhQUFhO2FBQ25CO1NBQ0YsQ0FBQztRQUVGLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFBLElBQUk7O1lBQzFDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbkIsS0FBSyxlQUFlO29CQUNwQjt3QkFDRSxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLDBDQUFFLGFBQWEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBSSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMxRixNQUFNO3FCQUNQO2FBQ0E7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxvQ0FBUSxHQUFmOztRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE1BQUEsTUFBQSxJQUFJLENBQUMsS0FBSyxFQUFDLElBQUksbURBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyw2REFBNkQ7WUFDdEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBRU0sdUNBQVcsR0FBbEI7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUM7SUFFTyw4Q0FBa0IsR0FBMUIsVUFBMkIsT0FBdUI7UUFDaEQsNEdBQTRHO1FBQzVHLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVwRyxrQ0FBa0M7UUFDbEMsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzFHLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUM1RyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFeEcseURBQXlEO1FBQ3pELElBQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO1FBRXpCLE9BQU8sOFpBUzRDLE9BQU8sQ0FBQyxTQUFTLGlDQUF1QixLQUFLLDZIQUVsRixhQUFhLDBEQUNiLGNBQWMsMERBQ2QsWUFBWSx3UEFRVCxLQUFLLHNCQUFVLFNBQVMsK0NBRWxDLENBQUM7SUFDVixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBckZELElBcUZDOztBQUVELFNBQVMsUUFBUTtJQUNmLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQU0sUUFBUSxHQUFHLGdFQUFnRSxDQUFDO0lBQ2xGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDM0IsSUFBSSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDdEU7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMifQ==