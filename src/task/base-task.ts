import { Identifier } from "common";

export enum TaskType {
    Init = 1,
    Execute
}

export interface BaseTaskOptions { }

export interface BaseTask<TOptions extends BaseTaskOptions> {
    id: Identifier;
    type: TaskType;
    silent: boolean;
    options: TOptions;
}

export interface SemiTask extends Partial<BaseTask<BaseTaskOptions>> {
    id?: undefined
    type: TaskType;
    options: BaseTaskOptions;
}

export function createTask<TTask extends BaseTask<BaseTaskOptions>>(semiTask: SemiTask & Partial<TTask>): TTask {
    const task: TTask = semiTask as any;

    task.id = Identifier.generate();
    task.silent = task.silent || false;

    return task;
}