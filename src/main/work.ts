
namespace bee.main {
    function test<TResult>(w: Work0<TResult>): Work0<TResult>;
    function test<TArg1, TResult>(w: Work1<TArg1, TResult>): Work1<TArg1, TResult>;
    function test<TArg1, TArg2, TResult>(w: Work<TArg1, TArg2, TResult>) {
        return w;
    }

    export type Work<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TResult> =
        Work0<TResult> |
        Work1<TArg1, TResult> |
        Work2<TArg1, TArg2, TResult> |
        Work3<TArg1, TArg2, TArg3, TResult> |
        Work4<TArg1, TArg2, TArg3, TArg4, TResult> |
        Work5<TArg1, TArg2, TArg3, TArg4, TArg5, TResult> |
        Work6<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TResult> |
        Work7<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TResult>;

    export type Work0<TResult> =
        () => TResult;
    export type Work1<TArg1, TResult> =
        (arg1: TArg1) => TResult;
    export type Work2<TArg1, TArg2, TResult> =
        (arg1: TArg1, arg2: TArg2) => TResult;
    export type Work3<TArg1, TArg2, TArg3, TResult> =
        (arg1: TArg1, arg2: TArg2, arg3: TArg3) => TResult;
    export type Work4<TArg1, TArg2, TArg3, TArg4, TResult> =
        (arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4) => TResult;
    export type Work5<TArg1, TArg2, TArg3, TArg4, TArg5, TResult> =
        (arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4, arg5: TArg5) => TResult;
    export type Work6<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TResult> =
        (arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4, arg5: TArg5, arg6: TArg6) => TResult;
    export type Work7<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TResult> =
        (arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4, arg5: TArg5, arg6: TArg6, arg7: TArg7) => TResult;

    export type AsyncWork<TArg, TResult> = Work<TArg, Promise<TResult>>;
}
