import { PipeFunction } from './Observable';
import { AnyFunction } from './utils';

export const tap = (cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: any): any {
            cb(arg);
            return arg;
        },
    };
};
