# Requirements

## Contents

0. Contents
1. Loading the library
2. Execution
    1. Single function
    - Provide the function
    - Execute the provided function
    - Consume the result
    2. Multiple named functions
    - Define named functions
    - Execute named functions
    - Consume execution result
    3. Set execution context
3. Loading additional scripts on the worker
4. References

## Loading the library

The library will export single `bee()` function which will be the main entry point.
It will be used to create a new worker thread and execute a particular function.

The exported function will be imported, where needed. The library will be using EcmaScript 2015 modules.

```typescript
import { bee } from 'beehive';

const worker = bee(/* ... */);
```

## Using the library

There are two ways to execute a function(s) on the worker:

1. Provide a single function which can be executed when required.
2. Provide multiple named functions, and context. Both (the functions and the context) will be attached to the worker. The functions can be executed when required.

In both cases the following applies:

- A function can have **zero** or **one** typed argument. The argument will be provided when the user executes the function.
- The provided function can return **zero** (`void`), **one** (specific value or object) or **multiple** ([`Generator`] or [`Observable`]) results.
- The provided function can return value asyncroniously (using [`Promise`], [`Observable`] or [`Async Generator`]). When the function is executed, the library will wait for the result from the async operation and then emit the value(s).
- When the function is started it will return [`Observable`]. The operation will be executed once there is [`Subscription`] to the [`Observable`]  (call `subscribe()`). When the provided function returns multiple values (using [`Observable`] or [`Generator`]) they will be provided in stream (one by one) to the returned [`Observable`].

### 1. Single function

Provide a single function to the worker. Execute it when required.

#### Provide the function

You can provide the function as argument when calling `bee()`.
The function can have zero or one argument.

Example:

```typescript
const slowFunction = (p: number) => { /* ... */ };

const worker = bee(slowFunction);
```

#### Execute the provided function

Once there is a function provided to the worker, you can execute it by calling `work()`. If the function requires an argument, you must provided it when calling `work()`.

Examples:

```typescript
const slowFunctionA = (p: number | string) => { /* ... */ };
const slowFunctionB = () => { /* ... */ };
const slowFunctionC = (o: MyType) => { /* ... */ };

// 1 - primitive argument
const worker1 = bee(slowFunctionA);
const result1 = worker1.work(1);

// 2 - no argument
const result2 = bee(slowFunctionB).work();

// 3 - custom type for argument
const worker3 = bee(slowFunctionC);
const result3 = worker3.work({ /* implements MyType */});
```

#### Consume the result

When `work()` is called it prepares the worker and returns an [`Observable`]. Once `Observable.subscribe()` is called the execution is started.

The [`Subscription`] will recieve the result of the execution. If there are multiple results (using [`Generator`] or [`Observable`]), each of them will be individually emitted the stream.

Examples:

1. Single result, sync execution

```typescript
const worker = 
    bee((n: number) => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += sum;
        }
        return sum;
    });

const result = worker.work(100000);
// 'sum' is the result of the execution
result.subscribe(sum => console.log(sum));
```

2. Single result, async execustion - with Promise

```typescript
const worker =
    bee(async (timeout: number) => {
        return new Promise<string>(resolve =>
            setTimeout(
                () => resolve('done'),
                timeout
            ));
    });

// pronts 'done' (the result from the Promise)
worker.work(1000).subscribe(done => console.log(done));
```

3. Multiple results, sync execution - with [`Generator`].

```typescript
const worker =
    // provide a Generator function
    bee(function* () => {
        for (let i = 1; i <= 100; i++) {
            // yield the numbers from 1 to 100
            yield i;
        }
    });

worker
    .work()
    // you can call all Observable operators, e.g. map() to modify the result
    .map(p => `${p}%`)
    // start the actual execution and print all values from 1% to 100%
    .subscribe(p => console.log(p));
```

4. Multiple results, async execution - with [`Async Generator`].

```typescript
// waits a given number of milliseconds and resolve the promise
async function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(
            () => resolve(ms),
            ms
        ));
}

const worker =
    // declare an Async Generator
    bee(async function* (sleep: ((ms: number) => Promise<number>)) {
        for (let i = 0; i < 10; i++) {
            // make it async - before each step sleep for some ms
            await sleep(i * 100);
            yield i;
        }
    });

worker
    // the function will execute on the worker and won't have access to the sleep() function, so give it as argument
    // a cleaner solution is to use named function or provide a context
    //      (see 2.2. Multiple named function and 2.3. Set execution context)
    .work(sleep)
    // this will be executed 10 times - for every number from 0 to 9
    .subscribe(i => console.log(i));
```

5. Multiple results, async execution - with [`Observable`]

```typescript
// create Observable that emits 1, 2, 3
const worker = bee(() => Observable.of(1, 2, 3));

worker
    .work()
    // executed 3 times
    .subscribe(val => console.log(val));
```

### Multiple named functions

In general, the named functions behave the same as the `work()` function. They are defined, executed and consumed in similar way.

Using named functions you gain the following benefits:
- Make a single worker capable of executing different functions;
- When executing a function on the worker, it can call other named functions on the worker;
- Give more meaningfull names to the functions (instead of the general `work()`).

#### Define named function

The functions are attached to an object and provided to the worker. You can define the functions when calling `bee()`.

Similar to `work()`, named functions can have zero or one argument. When argument is required it should be passed to the function when executed.

Example. All three workers below will have the same set of named functions:

```typescript
// object containing all named functions
const myFunctions = {
    functionA: () => { /* ... */ },
    functionB: (n: number) => { /* ... */ },
    functionC: (o: MyType) => { /* ... */ },
}

// pass object with 'functions' property containing the function
const worker1 = bee({
        functions: myFunctions
    });
```

#### Execute named functions

Named function can be executed by calling `work.functionName()`. The function name is the same as it is in the object provided. If the function requires an argument, it must be provided.

```typescript
const worker = bee({
    functions: {
        funcA: () => { /* ... */ },
        funcB: (n: number) => { /* ... */ },
        funcC: (o: MyType) => { /* ... */ }
    }
});

worker.work.funcA();
worker.work.funcB(5);
worker.work.funcC({ /* implements MyType */ });
```

#### Consume execution result

The execution result is consumed the same way as it is consumed when calling `work()`. See _2.1.4. Consuming execution result_.

The major difference is that, when you call named function from another named function (inside the worker) it won't return `Observable`. In that case the function will be synchronously executed on the worker, and it will directly return the result.

Example:

```typescript
const worker = bee({
    // define two named funcetions: add(), sum()
    functions: {
        // add() requires array with two numbers, and return another number
        add: (num: [number, number]) => num[0] + num[1],
        sum: (n: number) => {
            let result = 0;
            for (let i = 0; i < n; i++) {
                // call add() and provide array with two numbers
                // the result is also a number, and not an Observable
                result = this.add([result, i]);
            }
            return result;
        }
    }
});

worker.work
    .sum(10000)
    .subscribe(sum => console.log(sum));
```

### Set execution context

Execution context can be used to give additional data to the worker when executing functions. The context is shared across all functions in that worker. It is accessed by using the `this` keyword.

It can also contain other functions. Those functions will be treated as regular functions. They won't be accessible thru `work.funcName()`.
There won't be any functional difference if called outside or inside the worker. In both cases they will be executed synchronously and will directly return the result.

Execution context is set when calling `bee()`. The context itself is object containing all values required.

Example:

1. Setting context

```typescript
// set context in bee()
const worker1 = bee({
    context: {
        valueA: 15,
        valueB: 'test'
    }
});
```

2. Using the context to pass additional data

```typescript
// define data that will be set to the context of the worker
const myData: MyType[] = [ /* ... */ ];
const worker = bee({
    // the context contains array of data
    context: {
        data: myData
    },
    // the named functions work with the data inside the context
    functions: {
        // filter the data, but do not return it - it stays on the worker
        filter: (filterFn: ((row: MyType) => boolean)) => {
            this.data = this.data.filter(filterFn);
        },
        // sort the data, but do not return it - it stays on teh worker
        sort: (sortFn: ((rowA: MyType, rowB: MyType) => number)) => {
            this.data = this.data.sort(filterFn);
        },
        // return the current state of the data
        getData: () => {
            return this.data;
        }
    }
});

// we want all three functions to execute one after another
// so we concatenate the observables
// otherwise they will execute simultaneously, and the returned data will not guaranteed to be filtered and sorted
Observable
    .concat([
        worker.work.filter(row => row.value < 100),
        worker.work.sort((a, b) => a.id - b.id),
        worker.work.getData()
    ])
    // because of the concatenation, the emited values will be:
    // undefined, undefined, [ data ]
    // so we filter it and remove undefined values
    .filter(value => value !== undefined)
    // prints the filtered and sorted data
    .subscribe(result => console.log(result));
```

3. Use the context to provide additional functions

```typescript
const myData: MyType[] = [ /* ... */ ];
const worker = bee({
    // add data and functions to the context
    context: {
        data: myData,
        sleep: async function sleep(ms) {
            return new Promise(resolve =>
                setTimeout(() => resolve(ms), ms));
            },
        add: (a: number, b: number) => a + b
    },
    functions: {
        getData: () => {
            // in the worker you can call sleep() and add() the same way as other functions
            await this.sleep(1000);
            const result = this.data
                .filter(row => !row.isDeleted)
                .sort((a, b) => a.id - b.id)
                .map(row => this.add(row.valueA, row.valueB));
            return result;
        }
    }
});

worker.work.getData().subscribe(data => console.log(data));
// functions attached to the context cannot be executed outside the worker
// worker.work.sleep() and worker.work.add() are not available here
```

## Loading additional scripts on the worker

The worker is in isolation from the main thread and the other workers. This means it does not have access to the DOM and all scripts (libraries and frameworks) loaded on the main thread. There is no way to access the DOM on the worker, but you can load script to add functionality.

To load scripts, you must provide array of `scripts` when calling `bee()`. You can use this to load third-party libraries or custom script to add context or functions to the worker. 

`bee<TContext, TFunctions>()` is generic and will try to get the type of the context and the list of functions based on the provided values, but if there is additional context or functions loaded from a script, you must explicitly set `TFunctions` and `TContext`. This will allow you to execute the loaded functions and will provide you an intelisense for the context.

Example:

```typescript
// explicitly set types for Context and Functions
type Context = {
    data: MyType[];
    value: MyType;
    id: number;
    otherValue: MyType;
}
type Functions = {
    getData(): MyType[];
    setData(data: MyType[]): void;
    resetData(): void;
    doSomething(): void;
}

const worker = bee<Context, Functions>({
    // provide context and function here and in script.js
    context: {
        otherValue: { /* ... */ }
    },
    functions: {
        // functions here have the full context
        // "value" is defined in script.js, "otherValue" is defined here
        doSomething: () => {
            this.value = this.otherValue;
         }
    },
    // add list of script
    scripts: [
        '/app/scripts/script.js'
    ]
});

// you can call any of the functions
worker.work.getData().subscribe(data => console.log(data));
worker.work.setData([ /* ... */ ]).subscribe();
worker.work.resetData().subscribe();
worker.work.doSomething().subscribe();
```

```javascript
// script.js:

// you can set global variables, which will be part of the context
// keep in mind that 'this' and 'window' are actually not the real window object
// they are used so you can load third-party scripts which depend on that
this.data = [ /* ... */ ];
window.value = { /* ... */ };
var id = 5;

// you can also attach global functions, which will be part of the list of functions in the worker
this.getData = function() { return this.data };
window.setData = function(data) { window.data = data };
// they have access to the full context 
// 'data' is defined in the worker, and 'otherValue' is defined in the main thread when calling bee()
function addData() { this.data.push(this.otherValue); }
```

## Summary & Simple API

```typescript
// simple worker - work()
type Work<TArg, TResult> = (arg: TArg) => TResult;
type AsyncWork<TArg, TResult> = (arg: TArg) => Observable<TResult>;

interface SimpleBee<TArg, TResult> {
    work: AsyncWork<TArg, TResult>;
}

function bee<TArg, TResult>(work(TArg, TResult)): SimpleBee;

// multiple functions, context, scripts
interface Functions {
    [name: string]: Work;
}
interface WorkerConfig<TContext, TFunctions> {
    context: TContext;
    functions: TFunctions;
    scripts: string[];
}

interface SuperBee<TContext, TFunctions> {
    work: {
        [fn in keyof TFunctions]: 
    }
}
```

## References

1. [Generators and Iteration for ES5/ES3 (TypeScript docs)][1]
2. [RxJs][2]
3. [RxJs Introduction][3]
3. [Using Promises (MDN)][4]

[1]: http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
[2]: http://reactivex.io/rxjs/
[3]: http://reactivex.io/rxjs/manual/overview.html#introduction
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

[`Generator`]: http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
[`Async Generator`]: http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html
[`Observable`]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[`Subscription`]: http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html
[`Promise`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises