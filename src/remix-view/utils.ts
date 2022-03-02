declare const acquireVsCodeApi: () => { postMessage: (msg: { event: string, data?: unknown }) => void };

const vscode = acquireVsCodeApi();
export function send(msg: { event: string, data?: unknown }) {
  vscode.postMessage(msg);
}

export function subscribeToResource<T>(resource: string, cb: (data: T) => void) {
  const sub = (msg: MessageEvent<{ event: string, data: { resource: string, data: T } }>) => {
    if (msg.data.event === 'resourceUpdate' && msg.data.data.resource === resource) {
      cb(msg.data.data.data);
    }
  };
  window.addEventListener('message', sub);
  send({ event: 'subscribeToResource', data: resource });
  return () => window.removeEventListener('message', sub);
}