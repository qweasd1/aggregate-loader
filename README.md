# aggregate-loader

## basic idea

## auto scalar 

## group auto scalar

## TODO
* features
  * [done] add missing ids from return values
    * [done] you can add a default empty object to return if needed
    * [done] add fetch_one
  * Single Auto Scalar
    * [done] start from 1 (or given value) 
    * [done] monitor batch size and queue size and decide the current work size
    * [done] can't exceed max worker size
    * [done] state check has some interval (skip checking for a given time)
    * [done] set min worker size (default 1)
    * add unit test for AutoScalar
  * Group Auto Scalar (can constraint total worker size for a group of scalars)
    * [done] Add group
    * [later] add a weight for each group member so some member has higher chance to increase worker size (used to make sure some important member will have high chance to get more worker size) : optional and this can be implemented outside aggregate loader as a new Scalar
    * add unit test for Group scalar
  * Monitor
    * [later] add warning for queue size large (for monitor purpose) : you can read it directly from the AggregateLoader, so end user can build this logic by themselves for observerbility (if we add them, we might introduce performance burden for people don't need)

* fine tune the runner engine
  * [done] remove zero length request
  * [done] compare process.nextick and setImmediate: nextick is better
  * [later] put remove promise in later process so it won't block
* check memory leak
  * [done] do we have memory leak here ? (seems not, the major memory increasement is when load is big and some of the internal array is expand to larger )
  * [done] dead promise
