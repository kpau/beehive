import { Identifier } from "common";

export interface TaskResult<TResult> {
    taskId: Identifier;
    result: TResult;
    final: boolean;
}
