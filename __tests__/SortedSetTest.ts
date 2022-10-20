import { SortedSet } from "../src/SortedSet";

describe('test SortedSet', ()=> { 
  test('simple push and pop keys - should pop with order', ()=> { 
    const sortedSet = new SortedSet<string>()
    sortedSet.push("key1",2)
    sortedSet.push("key2",1)
    expect(sortedSet.pop()).toBe("key2")
    expect(sortedSet.pop()).toBe("key1")
    expect(sortedSet.pop()).toBe(undefined)
  })


  test('push duplicated keys - should pop according to the score when first push', ()=> { 
    const sortedSet = new SortedSet<string>()
    sortedSet.push("key1",1)
    sortedSet.push("key2",3)
    sortedSet.push("key1",4)
    expect(sortedSet.pop()).toBe("key1")
    expect(sortedSet.pop()).toBe("key2")
    expect(sortedSet.pop()).toBe(undefined)
  })
  describe('pop aligned batch keys', ()=> { 
    test('pop all batched keys', ()=> { 
      const sortedSet = new SortedSet<string>()
      sortedSet.push("key1",1)
      sortedSet.push("key2",3)
      sortedSet.push("key3",4)
      expect(sortedSet.popAlignedBatch(3)).toStrictEqual(["key1","key2","key3"])
    })

    test('pop partial batched keys', ()=> { 
      const sortedSet = new SortedSet<string>()
      sortedSet.push("key1",1)
      sortedSet.push("key2",3)
      sortedSet.push("key3",4)
      expect(sortedSet.popAlignedBatch(2)).toStrictEqual(["key1","key2"])
    })

    test('pop more than existing batched keys', ()=> { 
      const sortedSet = new SortedSet<string>()
      sortedSet.push("key1",1)
      sortedSet.push("key2",3)
      sortedSet.push("key3",4)
      expect(sortedSet.popAlignedBatch(5)).toStrictEqual(["key1","key2","key3"])
    })
  })
  
})