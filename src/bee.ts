
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