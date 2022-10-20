import { EntityKey, PromiseManager } from "./PromiseManager";
import { Scalar } from "./scalar/Scalar";
import { SortedSet } from "./SortedSet";

export class AggregateLoader<KEY extends EntityKey, ENTITY> {
  private runningWorkerCount: number;
  private fetchIdSortedSet: SortedSet<KEY>;
  private promiseManager: PromiseManager<KEY, ENTITY>;

  constructor(private options: AggregateLoaderOptions<KEY, ENTITY>) {
    this.runningWorkerCount = 0;
    this.fetchIdSortedSet = new SortedSet();
    this.promiseManager = new PromiseManager();
  }

  /**
   *
   * @param keys keys of entities to fetch
   * @param currentTime the time the fetch start, you can fix this value for multiple call to make sure multiple call go with the same batch
   * @returns
   */
  async fetch(
    keys: KEY[],
    currentTime: number = Date.now()
  ): Promise<(ENTITY | undefined)[]> {
    const result = this.promiseManager.getAggregatePromise(keys);
    for (const key of keys) {
      this.fetchIdSortedSet.push(key, currentTime);
    }

    this._scheduleBatchFetch();
    return result;
  }

  async fetchOne(
    key: KEY,
    currentTime: number = Date.now()
  ): Promise<ENTITY | undefined> {
    const result = this.promiseManager.getOrCreatePromise(key);
    this.fetchIdSortedSet.push(key, currentTime);
    this._scheduleBatchFetch();
    return result;
  }

  private _scheduleBatchFetch() {
    const isSkipFetch =
      this.runningWorkerCount >= this.options.scalar.workerSize ||
      this.fetchIdSortedSet.size === 0;
    if (isSkipFetch) {
      return;
    }

    process.nextTick(async () => {
      const isSkipFetch =
        this.runningWorkerCount >= this.options.scalar.workerSize ||
        this.fetchIdSortedSet.size === 0;
      if (isSkipFetch) {
        return;
      }

      this.runningWorkerCount++;
      await this._batchFetch();
      this.runningWorkerCount--;
      // if fetchIdSortedSet not empty, we continue
      if (this.fetchIdSortedSet.size > 0) {
        this._scheduleBatchFetch();
      }
    });
  }

  private async _batchFetch(): Promise<void> {
    const keys = this.fetchIdSortedSet.popAlignedBatch(this.options.batchSize);
    try {
      if (this.options.batchStartHook) {
        this.options.batchStartHook(keys);
      }
      // update the scalar stats, so scalar can try to auto scale the worker size
      this.options.scalar.updateStats(keys.length, this.queueSize);
      const result = await this.options.batchLoadFn(keys);
      if (this.options.batchEndHook) {
        this.options.batchEndHook(keys, result as any);
      }
      for (const key of keys) {
        if (result[key] === undefined) {
          result[key] = this.options.defaultValue as any;
        }
      }

      this.promiseManager.resolvePromises(result as any);
    } catch {
      this.promiseManager.rejectPromises(keys);
    }
  }

  get queueSize(): number {
    return this.fetchIdSortedSet.size;
  }
}

export interface AggregateLoaderOptions<KEY extends EntityKey, ENTITY> {
  batchLoadFn: BatchLoadFn<KEY, ENTITY>;
  batchSize: number;
  scalar: Scalar;
  defaultValue?: ENTITY;
  batchStartHook?: (keys: KEY[]) => void;
  batchEndHook?: (keys: KEY[], result: Record<KEY, ENTITY>) => void;
}

export type BatchLoadFn<KEY extends EntityKey, ENTITY> = (
  keys: KEY[]
) => Promise<Record<KEY, ENTITY[]>>;
