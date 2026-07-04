export interface RequestMemo {
  get<T>(key: string, loader: () => Promise<T>): Promise<T>;
}

export function createRequestMemo(): RequestMemo {
  const pending = new Map<string, Promise<unknown>>();

  return {
    get<T>(key: string, loader: () => Promise<T>): Promise<T> {
      const existing = pending.get(key) as Promise<T> | undefined;
      if (existing) return existing;

      const request = loader().catch((error) => {
        pending.delete(key);
        throw error;
      });
      pending.set(key, request);
      return request;
    },
  };
}
