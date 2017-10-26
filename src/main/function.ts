namespace bee.main {
    export interface FunctionBee<T1, T2> {
        (): T2;
        (n: T1): T2;
    }
}
