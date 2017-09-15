import { BaseTask, TaskResult } from "task";
import { TaskType } from "task";

export interface WorkerScope extends Window {
    importScripts: typeof importScripts;
    postMessage<TResult>(taskResult: TaskResult<TResult>): void;
    onmessage<TTask extends BaseTask<TTaskOptions>, TTaskOptions>(event: { data: TTask }): void;
}

export interface BeeWorker {
    tasks: {};
    addTask(type: keyof TaskType, task: Function);
}
