import { Scalar } from "./Scalar";

export class FixedScalar implements Scalar {
  constructor(public workerSize: number) {}
  updateStats(batchSize: number, queueSize: number) {
    // console.log(batchSize, queueSize);
  }
}

export function fixed(workerSize: number): Scalar {
  return new FixedScalar(workerSize);
}
