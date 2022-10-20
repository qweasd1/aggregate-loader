import { SingleAutoScalarOptions } from "./SingleAutoScalar";
import { Scalar } from "./Scalar";

export class GroupAutoScalar implements Scalar {
  public workerSize: number;

  public batchSizeWindow: number[];
  public queueSizeWindow: number[];

  public lastUpdateTimestamp: number;

  constructor(public options: GroupAutoScalarOptions) {
    if (options.maxBatchSize <= 0) {
      throw new Error(`maxBatchSize should be larger than 0`);
    }

    if (options.maxWorkerSize < 1) {
      throw new Error(`maxWorkerSize should be larger than 0`);
    }

    if (options.minWorkerSize < 1) {
      throw new Error(`minWorkerSize should be larger than 0`);
    }

    if (options.minWorkerSize > options.maxWorkerSize) {
      throw new Error(`minWorkerSize should be smaller than maxWorkerSize`);
    }

    if (options.maxWorkerSize > this.options.group.options.maxWorkerSize) {
      throw new Error(
        `single auto scalar inside group has worker size [${this.options.maxWorkerSize}] which is more than group's limit [${this.options.group.options.maxWorkerSize}]`
      );
    }
    this.options.group.increaseOrThrow(this.options.minWorkerSize);
    this.workerSize = this.options.minWorkerSize;
    this.options.onWorkerSizeChange &&
      this.options.onWorkerSizeChange(this.workerSize);
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
      this.options.group.canCreateMoreWorker() &&
      averageQueueSize >= this.options.maxBatchSize &&
      averagebatchSize >= this.options.maxBatchSize
    ) {
      this.workerSize += 1;
      this.options.group.increase();
      this.lastUpdateTimestamp = Date.now();
      if (this.options.onWorkerSizeChange) {
        this.options.onWorkerSizeChange(this.workerSize);
      }
    } else if (
      this.workerSize > this.options.minWorkerSize && // only when we can decrease worker size we increase
      averageQueueSize === 0 &&
      (this.options.maxBatchSize - averagebatchSize) * this.workerSize >=
        this.options.maxBatchSize
    ) {
      this.workerSize -= 1;
      this.options.group.decrease();
      this.lastUpdateTimestamp = Date.now();
      if (this.options.onWorkerSizeChange) {
        this.options.onWorkerSizeChange(this.workerSize);
      }
    }
  }
}

export class AutoScaleGroup {
  currentWorkerSize: number = 0;
  constructor(public options: AutoScaleGroupOptions) {}

  canCreateMoreWorker(): boolean {
    return this.currentWorkerSize < this.options.maxWorkerSize;
  }

  increaseOrThrow(n: number) {
    if (this.currentWorkerSize + n > this.options.maxWorkerSize) {
      throw new Error(`required worker number is larger than group limit`);
    }
    this.currentWorkerSize += n;
    this.options.onWorkerSizeChange &&
      this.options.onWorkerSizeChange(this.currentWorkerSize);
  }

  increase() {
    if (this.currentWorkerSize < this.options.maxWorkerSize) {
      this.currentWorkerSize += 1;
      this.options.onWorkerSizeChange &&
        this.options.onWorkerSizeChange(this.currentWorkerSize);
    }
  }

  decrease() {
    if (this.currentWorkerSize > 0) {
      this.currentWorkerSize -= 1;
      this.options.onWorkerSizeChange &&
        this.options.onWorkerSizeChange(this.currentWorkerSize);
    }
  }

  scale(options: Partial<SingleAutoScalarOptions> = {}): GroupAutoScalar {
    return new GroupAutoScalar({
      maxWorkerSize:
        options.maxWorkerSize === undefined ? 1 : options.maxWorkerSize,
      minWorkerSize:
        options.minWorkerSize === undefined ? 1 : options.minWorkerSize,
      maxBatchSize:
        options.maxBatchSize === undefined ? 150 : options.maxBatchSize,
      updateLeastInterval: options.updateLeastInterval || 500,
      windowSize: options.windowSize || 50,
      onWorkerSizeChange: options.onWorkerSizeChange,
      group: this,
    });
  }
}

export interface AutoScaleGroupOptions {
  maxWorkerSize: number;
  onWorkerSizeChange?: (workerSize: number) => void;
}

export function scaleGroup(options: AutoScaleGroupOptions): AutoScaleGroup {
  return new AutoScaleGroup(options);
}

export interface GroupAutoScalarOptions extends SingleAutoScalarOptions {
  group: AutoScaleGroup;
}
