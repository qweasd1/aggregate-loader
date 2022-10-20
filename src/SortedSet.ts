import {FlatQueue} from "./FlatQueue";

export class SortedSet<T> {
  priorityQueue: FlatQueue<T>;
  keys: Set<T>;
  constructor() {
    this.priorityQueue = new FlatQueue();
    this.keys = new Set();
  }

  push(key: T, score: number) {
    if (this.keys.has(key)) {
      return;
    }
    this.keys.add(key);
    this.priorityQueue.push(key, score);
  }

  pop(): T | undefined {
    const key = this.priorityQueue.pop();
    if (key === undefined) {
      return undefined;
    }
    this.keys.delete(key);
    return key;
  }

  /**
   * pop batched keys while keep the trailing keys with the same score all returned (so it's possible the return size is bigger than batchSize)
   * we process like this because we want to make sure the keys from same request won't split into two batch and increase the network delay
   * @param batchSize
   * @returns keys
   */
  popAlignedBatch(batchSize: number): T[] {
    const keys: T[] = [];
    let lastScore: number = -1;
    for (let i = 0; i < batchSize; i++) {
      const nextKey = this.priorityQueue.peek();
      lastScore = this.priorityQueue.peekValue() || -1;
      if (nextKey === undefined) {
        return keys;
      }
      keys.push(nextKey);
      this.pop()
    }
    while (true) {
      const nextScore = this.priorityQueue.peekValue();
      if(nextScore === undefined) {
        break
      }

      if(nextScore !== lastScore) {
        break
      }

      keys.push(this.pop()!)
    }
    
    return keys;
  }

  get size() {
    return this.priorityQueue.length;
  }
}
