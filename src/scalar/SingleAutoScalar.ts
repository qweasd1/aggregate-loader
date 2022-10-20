import { Scalar } from "./Scalar";

export class SingleAutoScalar implements Scalar {
  public workerSize: number;

  public batchSizeWindow: number[];
  public queueSizeWindow: number[];

  public lastUpdateTimestamp: number;

  constructor(public options: SingleAutoScalarOptions) {
    if (options.maxBatchSize <= 0) {
      throw new Error(
        `maxBatchSize should be larger than 0`
      );
    }

    if (options.maxWorkerSize < 1) {
      throw new Error(
        `maxWorkerSize should be larger than 0`
      );
    }

    if (options.minWorkerSize < 1) {
      throw new Error(
        `minWorkerSize should be larger than 0`
      );
    }

    if (options.minWorkerSize > options.maxWorkerSize) {
      throw new Error(
        `minWorkerSize should be smaller than maxWorkerSize`
      );
    }


    this.workerSize = this.options.minWorkerSize;
    this.options.onWorkerSizeChange && this.options.onWorkerSizeChange(this.workerSize)
    this.batchSizeWindow = [];
    this.queueSizeWindow = [];
    this.lastUpdateTimestamp = Date.now();
  }
  updateStats(batchSize: number, queueSize: number) {
    this.batchSizeWindow.push(batchSize);
    this.queueSizeWindow.push(queueSize);
    if (this.batchSizeWindow.length > this.options.windowSize) {
      this.batchSizeWindow.shift();
      this.queueSizeWindow.shift();
    }

    // early stop since we just change the the worker size
    if (
      Date.now() - this.lastUpdateTimestamp <
      this.options.updateLeastInterval
    ) {
      return;
    }

    let averagebatchSize = 0;
    let averageQueueSize = 0;
    for (let i = 0; i < this.batchSizeWindow.length; i++) {
      averagebatchSize += this.batchSizeWindow[i];
      averageQueueSize += this.queueSizeWindow[i];
    }
    averagebatchSize = averagebatchSize / this.batchSizeWindow.length;
    averageQueueSize = averageQueueSize / this.batchSizeWindow.length;

    if (
      this.workerSize < this.options.maxWorkerSize && // only when we can increase worker size we increase
      averageQueueSize >= this.options.maxBatchSize &&
      averagebatchSize >= this.options.maxBatchSize
    ) {
      this.workerSize += 1;
      this.lastUpdateTimestamp = Date.now();
      if(this.options.onWorkerSizeChange) {
        this.options.onWorkerSizeChange(this.workerSize)
      }
    } else if (
      this.workerSize > this.options.minWorkerSize && // only when we can decrease worker size we increase
      averageQueueSize === 0 &&
      (this.options.maxBatchSize - averagebatchSize) * this.workerSize >=
        this.options.maxBatchSize
    ) {
      this.workerSize -= 1;
      this.lastUpdateTimestamp = Date.now();
      if(this.options.onWorkerSizeChange) {
        this.options.onWorkerSizeChange(this.workerSize)
      }
    }
  }
}

export function scale(options: Partial<SingleAutoScalarOptions> = {}): Scalar {
  return new SingleAutoScalar({
    maxWorkerSize: options.maxWorkerSize === undefined ? 1 : options.maxWorkerSize,
    minWorkerSize: options.minWorkerSize === undefined ? 1 : options.minWorkerSize,
    maxBatchSize: options.maxBatchSize === undefined ? 150 : options.maxBatchSize,
    updateLeastInterval: options.updateLeastInterval || 500,
    windowSize: options.windowSize || 50,
    onWorkerSizeChange:options.onWorkerSizeChange
  });
}

export interface SingleAutoScalarOptions {
  maxWorkerSize: number;
  minWorkerSize: number;
  maxBatchSize: number;
  updateLeastInterval: number; // ms, the least interval worker size can increase/descrease, try to prevent the interval increase/decrease too fast and generate jitter
  windowSize: number;
  onWorkerSizeChange?: (workerSize: number) => void; // callback, trigger when workerSize changed
}
