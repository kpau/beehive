
// import { Dictionary, Identifier } from "common";
// import { WorkerInstance, url } from "worker";
// import { BaseTask, BaseTaskOptions, InitTask, TaskType, createInitTask, TaskResult } from "task";

/*
export class Bee {
    private worker: WorkerInstance;
    private pendingTasks: Dictionary<any> = {};
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

    private startTask<TTask extends BaseTask<TTaskOptions>, TTaskOptions, TResult>(task: TTask) {
        const taskId = Identifier.generate();

        // const task$: Observable<TResult> = Observable.create(
            (observer: any) => {
            this.worker.postMessage(task);

            if (!task.silent) {
                this.pendingTasks[taskId] = observer;
            }
        }
    }

    private init() {
        const task = createInitTask(this.id);

        return this.startTask(task);
    }
}
*/

function bee() {
    return 'test';
}
