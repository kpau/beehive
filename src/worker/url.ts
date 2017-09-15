import { start } from "worker";

export const url: string = (function (workerFn: Function) {
    const workerCodeString = `(${workerFn.toString()})(self);`;
    const blob = new Blob([workerCodeString]);
    const blobUrl = window.URL.createObjectURL(blob);
    return blobUrl;
})(start);
