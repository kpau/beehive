export type Identifier = string;

export namespace Identifier {
    let count = 0;
    export function generate(): Identifier {
        return (++count).toString();
    }
}
