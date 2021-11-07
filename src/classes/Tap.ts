import { PipeFunction } from './Observable';
import { AnyFunction, deepClone } from './utils';

export const tap = (cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: any): any {
            const argClone = deepClone(arg);
            cb(argClone);
            return arg;
        },
    };
};
