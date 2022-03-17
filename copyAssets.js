/* eslint-disable */
const fs = require('fs');

(async () => {
	fs.copyFile('./node_modules/@vscode/codicons/dist/codicon.css', './dist/remix-view/codicon.css', () => null);
	fs.copyFile('./node_modules/@vscode/codicons/dist/codicon.ttf', './dist/remix-view/codicon.ttf', () => null);
})()