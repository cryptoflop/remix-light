import { useEffect, useState } from 'react';
import { send, subscribeToResource } from '../utils';

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