import { AutoScaleGroup, scaleGroup } from "../src/scalar/GroupAutoScalar";
import { scale } from "../src/scalar/SingleAutoScalar";

describe("create single auto scalar", () => {
  test("normal createion should success", () => {
    expect(() => {
      scale({
        minWorkerSize: 1,
        maxBatchSize: 150,
        maxWorkerSize: 2,
      });
    }).not.toThrowError();
  });

  test("miss config should success", () => {
    expect(() => {
      scale();
    }).not.toThrowError();
  });

  test("batch size less equal to 0 should fail", () => {
    expect(() => {
      scale({
        maxBatchSize: 0,
      });
    }).toThrowError();

    expect(() => {
      scale({
        maxBatchSize: -1,
      });
    }).toThrowError();
  });

  test("maxWorkerSize less equal to 0 should fail", () => {
    expect(() => {
      scale({
        maxWorkerSize: 0,
      });
    }).toThrowError();

    expect(() => {
      scale({
        maxWorkerSize: -1,
      });
    }).toThrowError();
  });

  test("minWorkerSize less equal to 0 should fail", () => {
    expect(() => {
      scale({
        minWorkerSize: 0,
      });
    }).toThrowError();

    expect(() => {
      scale({
        minWorkerSize: -1,
      });
    }).toThrowError();
  });

  test("minWorkerSize larger than maxWorkerSize should fail", () => {
    expect(() => {
      scale({
        minWorkerSize: 3,
        maxWorkerSize: 2,
      });
    }).toThrowError();
  });
});

describe("create group auto scalar", () => {
  let group:AutoScaleGroup

  beforeEach(() => {
    group = scaleGroup({
      maxWorkerSize: 5,
    });
  });

  test("normal createion should success", () => {
    expect(() => {
      group.scale({
        minWorkerSize: 1,
        maxBatchSize: 150,
        maxWorkerSize: 2,
      });
    }).not.toThrowError();
  });

  test("miss config should success", () => {
    expect(() => {
      group.scale();
    }).not.toThrowError();
  });

  test("batch size less equal to 0 should fail", () => {
    expect(() => {
      group.scale({
        maxBatchSize: 0,
      });
    }).toThrowError();

    expect(() => {
      group.scale({
        maxBatchSize: -1,
      });
    }).toThrowError();
  });

  test("maxWorkerSize less equal to 0 should fail", () => {
    expect(() => {
      group.scale({
        maxWorkerSize: 0,
      });
    }).toThrowError();

    expect(() => {
      group.scale({
        maxWorkerSize: -1,
      });
    }).toThrowError();
  });

  test("minWorkerSize less equal to 0 should fail", () => {
    expect(() => {
      group.scale({
        minWorkerSize: 0,
      });
    }).toThrowError();

    expect(() => {
      group.scale({
        minWorkerSize: -1,
      });
    }).toThrowError();
  });

  test("minWorkerSize larger than maxWorkerSize should fail", () => {
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 2,
      });
    }).toThrowError();
  });

  test('member scalar should has maxWorkerSize less equal to group maxWorkerSize - equal', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 5,
      });
    }).not.toThrowError();
  })

  test('member scalar should has maxWorkerSize less equal to group maxWorkerSize - less', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 4,
      });
    }).not.toThrowError();
  })

  test('member scalar should has maxWorkerSize less equal to group maxWorkerSize - larger should fail', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 6,
      });
    }).toThrowError();
  })

  test('multiple member scalars should has sum of minWorkerSize less equal to group maxWorkerSize - exactly equal should success', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 5,
      });

      group.scale({
        minWorkerSize: 2,
        maxWorkerSize: 5,
      });
    }).not.toThrowError();
  })

  test('multiple member scalars should has sum of minWorkerSize less equal to group maxWorkerSize - less should success', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 5,
      });

      group.scale({
        minWorkerSize: 1,
        maxWorkerSize: 5,
      });
    }).not.toThrowError();
  })

  test('multiple member scalars should has sum of minWorkerSize less equal to group maxWorkerSize - larger should fail', ()=> { 
    expect(() => {
      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 5,
      });

      group.scale({
        minWorkerSize: 3,
        maxWorkerSize: 5,
      });
    }).toThrowError();
  })
});
