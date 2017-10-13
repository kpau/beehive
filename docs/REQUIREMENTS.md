# Requirements

## How should be used

```typescript
// load library as ES 2015 module
import { bee } from 'beehive'

// example function making slow calculations
// have zero or one argument (not more)
// argument and return type are _whatever_
function slowCalculations(arg: SomeType): OtherType {
    /* ... */
}

// example argument
let obj: SomeType = { /* ... */ }

// create bee with bee(func) which returns async function
// execute the async function and await it to get the result
// the result is the same type as the original function return type
let result: OtherType = await bee(slowCalculations)(obj);
```

## API

```typescript
// sync function - passed to the bee()
interface Work<TArg, TRes> {
    (arg: TArg): TRes
}

// async function - returned from the bee()
interface AsyncWork<TArg, TRes> {
    (arg: TArg): Promise<TRes>
}

// bee() accepts sync function and returns async function
function bee<TArg, TRes>(work: Work<TArg, TRes>): AsyncWork<TArg, TRes> {
    /* ... */
}
```
