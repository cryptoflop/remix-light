import { Subject } from 'rxjs';

export default function createResources(onSet: (prop: string, value: unknown) => void) {
  const resources = new Proxy({}, {
    set(target: { [key: string]: unknown }, prop: string, value: unknown) {
      target[prop] = value;
      onSet(prop, value);
      return true;
    }
  });

  const subscribableResources: Record<string, (() => Promise<unknown>) | undefined> = {};

  const $resourceSet = new Subject<{ resource: string, data: unknown }>();

  const api = {
    subscribeToResource: async (resource: string) => {
      let data;
      const resourceGetter = subscribableResources[resource];
      if (resourceGetter) {
        data = await resourceGetter();
      }
      if (data !== undefined) {
        resources[resource] = data;
      } else {
        if (resources[resource] !== undefined) {
          resources[resource] = resources[resource];
        }
      }
    },
    setResource: (msg: { resource: string, data: unknown }) => {
      resources[msg.resource] = msg.data;
      $resourceSet.next(msg);
    }
  };

  return [resources, api, $resourceSet.asObservable(), subscribableResources] as const;
}

export type Resources = ReturnType<typeof createResources>[0];
export type ResourceSetObservable = ReturnType<typeof createResources>[2];
export type SubscribableResources = ReturnType<typeof createResources>[3];