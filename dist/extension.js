"use strict";
exports.__esModule = true;
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var RemixView_1 = require("./remix-view/RemixView");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    var out = vscode.window.createOutputChannel('Remix-Light');
    var remixViewProvider = new RemixView_1["default"](context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('remix-light-view', remixViewProvider));
}
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2V4dGVuc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QsOEVBQThFO0FBQzlFLCtCQUFpQztBQUNqQyxvREFBdUQ7QUFFdkQseURBQXlEO0FBQ3pELDBFQUEwRTtBQUMxRSxTQUFnQixRQUFRLENBQUMsT0FBZ0M7SUFDdkQsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUU3RCxJQUFNLGlCQUFpQixHQUFHLElBQUksc0JBQWlCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRXRFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUV0RixDQUFDO0FBUkQsNEJBUUMifQ==