import { useEffect, useState } from 'react';
import { send } from '../utils';

const resourceCache: Record<string, unknown> = {};

window.addEventListener('message', (msg: MessageEvent<{ event: string, data: { resource: string, data: unknown } }>) => {
  resourceCache[msg.data.event] = msg.data.data.data;
});

function subscribeToResource<T>(resource: string, cb: (data: T) => void) {
  const sub = (msg: MessageEvent<{ event: string, data: { resource: string, data: T } }>) => {
    if (msg.data.event === 'resourceUpdate' && msg.data.data.resource === resource) {
      cb(msg.data.data.data);
    }
  };
  window.addEventListener('message', sub);

  if (resourceCache[resource]) {
    cb(resourceCache[resource] as T);
  } else {
    // get resource
    send({ event: 'subscribeToResource', data: resource });
  }
  return () => window.removeEventListener('message', sub);
}

export function useResource<T>(resource: string, defaultValue?: T, onResult?: (data: T) => void) {
  const [res, setRes] = useState(defaultValue);
  useEffect(() => {
    return subscribeToResource(resource, (data: T) => {
      setRes(data);
      onResult && onResult(data);
    });
  }, []);
  return [res, (data: T) => send({ event: 'setResource', data: { resource, data } })] as [T, (data: T) => void];
}