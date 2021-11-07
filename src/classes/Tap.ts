import { PipeFunction } from './Observable';
import { AnyFunction, deepClone } from './utils';

export const tap = <T = any>(cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: T): T {
            const argClone = deepClone(arg);
            cb(argClone);
            return arg;
        },
    };
};
