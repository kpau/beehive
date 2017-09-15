import { BaseTask, TaskResult } from "task";

export interface MessageEvent<TResult> extends Event {
    data: TaskResult<TResult>;
}

export interface WorkerInstance extends Worker {
    importScripts: typeof importScripts;
    postMessage<TTask extends BaseTask<TTaskOptions>, TTaskOptions>(task: TTask): void;
    onmessage<TResult>(event: MessageEvent<TResult>): void;
    addEventListener<TResult>(eventName: 'message', listener: (event: MessageEvent<TResult>) => void): void;
}
