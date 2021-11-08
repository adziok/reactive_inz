import { PipeFunction } from '../Observable';
import { AnyFunction, deepClone } from '../utils';

export const tap = <T = any>(cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: T): T {
            try {
                const argClone = deepClone(arg);
                cb(argClone);
            } catch (e) {}
            return arg;
        },
    };
};
