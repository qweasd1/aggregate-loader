export class PromiseManager<KEY extends EntityKey, ENTITY> {
  public keyPromiseMap: Map<string, PromiseUnit<ENTITY | undefined>>;
  constructor() {
    this.keyPromiseMap = new Map();
  }

  getAggregatePromise(keys: KEY[]): Promise<(ENTITY | undefined)[]> {
    return Promise.all(keys.map((key) => this.getOrCreatePromise(key)));
  }

  getOrCreatePromise(key: KEY): Promise<ENTITY | undefined> {
    const _key = String(key);
    if (this.keyPromiseMap.has(_key)) {
      return this.keyPromiseMap.get(_key)!.promise!;
    } else {
      const promiseUnit: PromiseUnit<ENTITY | undefined> = {};
      const promise = new Promise<ENTITY | undefined>((resolve, reject) => {
        promiseUnit.reject = reject;
        promiseUnit.resolve = resolve;
      });
      promiseUnit.promise = promise;
      this.keyPromiseMap.set(_key, promiseUnit);
      return promise;
    }
  }

  resolvePromises(keyEntityMap: Record<string, ENTITY | undefined>) {
    for (const key of Object.keys(keyEntityMap)) {
      const promiseUnit = this.keyPromiseMap.get(key);
      if (promiseUnit) {
        promiseUnit.resolve!(keyEntityMap[key]);
        this.keyPromiseMap.delete(key);
      }
    }
  }

  // TODO: implementation not working for now, contains errors need more time to figure out what happens, however, do see performance increasement
  // put remove promise in later phase so might reduce the delay for response but add more cpu usage
  // resolvePromises(keyEntityMap: Record<string, ENTITY | undefined>) {
  //   for (const key of Object.keys(keyEntityMap)) {
  //     const promiseUnit = this.keyPromiseMap.get(key);
  //     if (promiseUnit) {
  //       promiseUnit.resolve!(keyEntityMap[key]);
  //     }
  //   }

  //   setImmediate(()=>{
  //     for (const key of Object.keys(keyEntityMap)) {
  //       const promiseUnit = this.keyPromiseMap.get(key);
  //       if (promiseUnit) {
  //         this.keyPromiseMap.delete(key)
  //       }
  //     }
  //   })
  // }

  rejectPromises(keies: KEY[]) {
    for (const key of keies) {
      const promiseUnit = this.keyPromiseMap.get(String(key));
      if (promiseUnit) {
        promiseUnit.reject!(key);
        this.keyPromiseMap.delete(String(key));
      }
    }
  }
}

interface PromiseUnit<ENTITY> {
  resolve?: (entity: ENTITY | undefined) => void;
  reject?: (error: any) => void;
  promise?: Promise<ENTITY | undefined>;
}

export type EntityKey = string | number;
