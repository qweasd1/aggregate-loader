export interface Scalar {
  workerSize: number;
  updateStats(batchSize: number, queueSize: number): void;
}
