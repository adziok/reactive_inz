import { PipeFunction } from '../Observable';
import { AnyFunction } from '../common/utils';

export const map = (cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: any): any {
            return cb(arg);
        },
    };
};
