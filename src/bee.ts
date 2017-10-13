
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { Dictionary, Identifier } from "common";
import { WorkerInstance, url } from "worker";
import { BaseTask, BaseTaskOptions, InitTask, TaskType, createInitTask, TaskResult } from "task";

export class Bee {
    private worker: WorkerInstance;
    private pendingTasks: Dictionary<Observer<any>> = {};
    public id: Identifier;

    constructor() {
        this.id = Identifier.generate();
        this.worker = new Worker(url) as WorkerInstance;

        this.worker.addEventListener('message', (e) => {
            this.onTaskProgress(e.data);
        });

        this.init();
    }

    private onTaskProgress<TResult>(taskResult: TaskResult<TResult>) {
        const task = this.pendingTasks[taskResult.taskId]
        task.next(taskResult.result);

        if (taskResult.final) {
            task.complete();
            delete this.pendingTasks[taskResult.taskId];
        }
    }

    private startTask<TTask extends BaseTask<TTaskOptions>, TTaskOptions, TResult>(task: TTask): Observable<TResult> {
        const taskId = Identifier.generate();

        const task$: Observable<TResult> = Observable.create((observer: Observer<TResult>) => {
            this.worker.postMessage(task);

            if (!task.silent) {
                this.pendingTasks[taskId] = observer;
            }
        });

        return task$;
    }

    private init() {
        const task = createInitTask(this.id);

        return this.startTask(task);
    }
}

class Test {
    add<TR>(f: () => TR): Test;
    add<TC>(o: TC): Test & TC;
    add<T>(a: T | (() => T)): Test | (Test & T) {
        throw 1;
    }

}

var t = new Test();
var r = t.add({ a: 1 });
var r2 = t.add(() => 1);

module Test2 {
    export function add<TR>(f: () => TR): Test;
    export function add<TC>(o: TC): Test & TC;
    export function add<T>(a: T | (() => T)): Test | (Test & T) {
        throw 1;
    }

}

var r3 = Test2.add({ b: 2 });
var r4 = Test2.add(() => 2)

interface Test3 {
    addWork<TRes>(f: () => TRes): this;
    addFunctions<TFunc>(func: TFunc): this & {[name in keyof TFunc]: Promise<TFunc[name]> };
    addContext<TCont>(context: TCont): this & TCont;
    
    add
        <TArg, TRes>
        (f: Work<TArg, TRes>)
        : this;
    add
        <TArg, TRes, TFunc extends { [name: string]: Work<TArg, TRes>}>
        (func: TFunc)
        : this & {[name in keyof TFunc]: AsyncWork<TArg, TRes> };
    add<TCont>(context: TCont): this & TCont;
}

var tt: Test3;
var ttt = tt
    // .add({a: 1})
    .add({ b: (n: number) => n * n})
    // .add((s: string) => +s)

type Work<TArg, TRes> = {
    (arg: TArg): TRes;
}

interface AsyncWork<TArg, TRes> {
    async (arg: TArg): TRes;
}

type A<TArg, TRes> = (arg: TArg) => TRes;
interface B<TArg, TRes> {
    [ key: string]: A<TArg, TRes>
}
interface C {
    func<TArg, TRes>(arg: B<TArg, TRes>): void;
}
let c: C;
c.func({ test: (n: number) => n.toString()});