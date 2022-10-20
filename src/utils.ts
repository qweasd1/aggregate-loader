import { BatchLoadFn } from "./AggregateLoader";
import { EntityKey } from "./PromiseManager";

export function arrayToRecord<KEY extends EntityKey, ENTITY> (
  fetchFn: (keys: KEY[]) => Promise<(ENTITY)[]>,
  keyFn: (entity:ENTITY)=> KEY
) : BatchLoadFn<KEY, ENTITY>  {
  return async function _fetchWrapper(keys:KEY[]) {
    const data = await fetchFn(keys)
    const result = {} as any;
    for (const entity of data) {
      result[keyFn(entity)] = entity;
    }
    return result;
  }
}
