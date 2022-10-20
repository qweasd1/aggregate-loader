import { PromiseManager } from "../src/PromiseManager";

describe("test Promise Manager", () => {
  test("get aggregate promise", async () => {
    const manager = new PromiseManager<string, string>();
    
    setImmediate(()=>{
      manager.resolvePromises({ a: "a1", b: "b1", c: "c1" });
    })

    const result = await manager.getAggregatePromise(["a", "b", "c"]);
    expect(result).toStrictEqual(["a1","b1","c1"])
  });

  test("get multiple aggregate promises", async () => {
    const manager = new PromiseManager<string, string>();
    
    setImmediate(()=>{
      manager.resolvePromises({ a: "a1", b: "b1", c: "c1" });
    })

    const result = await Promise.all([
      manager.getAggregatePromise(["a"]),
      manager.getAggregatePromise(["b"]),
    ])
    expect(result[0]).toStrictEqual(["a1"])
    expect(result[1]).toStrictEqual(["b1"])
  });


  test("get multiple aggregate reject", async () => {
    const manager = new PromiseManager<string, string>();
    
    setImmediate(()=>{
      manager.rejectPromises(["a","b","c"])
    })

    expect(async ()=> manager.getAggregatePromise(["a"])).rejects.toThrow()
  });
});
