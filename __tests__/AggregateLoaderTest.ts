import { AggregateLoader } from "../src/AggregateLoader";
import { fixed } from "../src/scalar/FixedScalar";

describe("test AggregateLoader", () => {
  let aggLoader: AggregateLoader<number, number>;

  beforeEach(() => {
    aggLoader = new AggregateLoader<number, number>({
      batchLoadFn: async (keys) => {
        const result = {} as any;
        for (const key of keys) {
          if (key === -1) {
            continue;
          }
          result[key] = key;
        }
        return result;
      },
      batchSize: 100,
      scalar:fixed(2)
    });
  });

  test("fetch single", async () => {
    expect(await aggLoader.fetch([1, 2, 3])).toStrictEqual([1, 2, 3]);
  });

  test("fetchOne - exists", async () => {
    expect(await aggLoader.fetchOne(1)).toStrictEqual(1);
  });

  test("fetchOne - not exists", async () => {
    expect(await aggLoader.fetchOne(-1)).toStrictEqual(undefined);
  });

  test("fetch multiples", async () => {
    expect(
      await Promise.all([
        aggLoader.fetch([1, 2, 3]),
        aggLoader.fetch([3, 4, 5]),
      ])
    ).toStrictEqual([
      [1, 2, 3],
      [3, 4, 5],
    ]);
  });

  test("fetch multiples with stages (the queue is emtpy after the first wait)", async () => {
    expect(
      await Promise.all([
        aggLoader.fetch([1,2,3]),
        aggLoader.fetch([3,4,5])
      ])
    ).toStrictEqual([
      [1,2,3],
      [3,4,5]
    ]);
    expect(aggLoader.queueSize).toBe(0)

    expect(
      await Promise.all([
        aggLoader.fetch([1,6,7]),
      ])
    ).toStrictEqual([
      [1,6,7]
    ]);
  });

  test("fetch multiples - check batch fetch trigger", async () => {
    let batchKeys: number[] = [];
    const aggLoader = new AggregateLoader<number, number>({
      batchStartHook: (keys) => {
        batchKeys = keys;
      },
      batchLoadFn: async (keys) => {
        const result = {} as any;
        for (const key of keys) {
          if (key === -1) {
            continue;
          }
          result[key] = key;
        }
        return result;
      },
      batchSize: 100,
      scalar:fixed(1)
    });

    const result = Promise.all([
      aggLoader.fetch([1, 2, 3]),
      aggLoader.fetch([3, 4, 5]),
    ]);

    expect(await result).toStrictEqual([
      [1, 2, 3],
      [3, 4, 5],
    ]);
    expect(batchKeys.sort()).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("fetch multiples - check batch fetch split at different time", async () => {
    let batchKeys: number[][] = [];
    const aggLoader = new AggregateLoader<number, number>({
      batchStartHook: (keys) => {
        batchKeys.push(keys.sort());
      },
      batchLoadFn: async (keys) => {
        const result = {} as any;
        for (const key of keys) {
          if (key === -1) {
            continue;
          }
          result[key] = key;
        }
        return result;
      },
      batchSize: 3,
      scalar:fixed(1)
    });

    const result = Promise.all([
      aggLoader.fetch([1, 2, 3], 10),
      aggLoader.fetch([3, 4, 5], 20),
    ]);

    expect(await result).toStrictEqual([
      [1, 2, 3],
      [3, 4, 5],
    ]);
    expect(batchKeys.sort()).toStrictEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  test("fetch multiples - check batch fetch align", async () => {
    let batchKeys: number[][] = [];
    const aggLoader = new AggregateLoader<number, number>({
      batchStartHook: (keys) => {
        batchKeys.push(keys.sort());
      },
      batchLoadFn: async (keys) => {
        const result = {} as any;
        for (const key of keys) {
          if (key === -1) {
            continue;
          }
          result[key] = key;
        }
        return result;
      },
      batchSize: 3,
      scalar:fixed(1)
    });

    const result = Promise.all([
      aggLoader.fetch([1, 2, 3], 10),
      aggLoader.fetch([3, 4, 5], 10),
      aggLoader.fetch([6, 7, 8], 20),
    ]);

    expect(await result).toStrictEqual([
      [1, 2, 3],
      [3, 4, 5],
      [6, 7, 8],
    ]);
    expect(batchKeys.sort()).toStrictEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8],
    ]);
  });

  test("fetch non existing key", async () => {
    expect(await aggLoader.fetch([-1, 2, 3])).toStrictEqual([undefined, 2, 3]);
  });

  test("fetch non existing key with default value", async () => {
    const aggLoader = new AggregateLoader<number, number>({
      batchLoadFn: async (keys) => {
        const result = {} as any;
        for (const key of keys) {
          if (key === -1) {
            continue;
          }
          result[key] = key;
        }
        return result;
      },
      batchSize: 100,
      scalar:fixed(1),
      defaultValue: 0,
    });

    expect(await aggLoader.fetch([-1, 2, 3])).toStrictEqual([0, 2, 3]);
  });
});
