
type Observable<T> = {};

interface ValueContainer<T> {
    value: T;
}

interface FunctionContainer {
    [key: string]: Function;
}

type FuncValContainer<T extends FunctionContainer> = {
    [key in keyof T]: T[key];
}

function func(obj: FunctionContainer): FuncValContainer<FunctionContainer> {
    let result: FuncValContainer<FunctionContainer> = {}
    for(let key in obj) {
        result[key] = function(...args: any[]) {
            const container: ValueContainer<any> = {
                value: obj[key].apply(this, args)
            };
            return container;
        }
    }
    return result;
}

// (n: number) => string
const toString = (n: number) => n.toString();
// (s: string) => number
const toNumber = (s: string) => parseFloat(s);

const obj: FunctionContainer = {

}

interface Work<TArg, TRes> {
    (arg: TArg): TRes
}

interface AsyncWork<TArg, TRes> {
    (arg: TArg): Promise<TRes>
}

function bee<TArg, TRes>(work: Work<TArg, TRes>): AsyncWork<TArg, TRes> {
    /* ... */
}