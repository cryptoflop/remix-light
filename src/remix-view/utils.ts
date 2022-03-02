declare const acquireVsCodeApi: () => { postMessage: (msg: { event: string, data?: unknown }) => void };

const vscode = acquireVsCodeApi();
export function send(msg: { event: string, data?: unknown }) {
  vscode.postMessage(msg);
}