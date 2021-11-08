import { AnyFunction, deepClone } from '../common/utils';
import { PipeFunction } from '../PipeExecutor';
import { PipeFunctionResult } from '../PipeFunctionResult';

export const tap = <T = any>(cb: AnyFunction): PipeFunction => {
    return {
        execute(arg: PipeFunctionResult<T, any>): PipeFunctionResult<T, any> {
            try {
                if (arg.isOk()) {
                    const argClone = deepClone(arg.value);
                    cb(argClone);
                }
            } catch (e) {}
            return arg;
        },
    };
};
