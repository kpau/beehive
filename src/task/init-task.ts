import { Identifier } from "common";
import { BaseTaskOptions, BaseTask, TaskType, createTask } from "task";

export interface InitTaskOptions extends BaseTaskOptions {
    workerId: Identifier;
}

export interface InitTask extends BaseTask<InitTaskOptions> {
    type: TaskType.Init;
    silent: true;
}

export function createInitTask(workerId: Identifier): InitTask {
    const task = createTask<InitTask>({
        type: TaskType.Init,
        silent: true,
        options: {
            workerId: workerId
        }
    });

    return task;
}