import { AnyFunction, deepClone } from '../common/utils';
import { PipeFunction } from '../PipeExecutor';
import { err, PipeFunctionResult, skip } from '../PipeFunctionResult';

export const ifDo = <T = any>(cb: AnyFunction, func: PipeFunction): PipeFunction => {
    return {
        async execute(arg: PipeFunctionResult<T, any>): Promise<PipeFunctionResult<T, any>> {
            try {
                if (arg.isOk()) {
                    const argClone = deepClone(arg.value);
                    const check = await cb(argClone);

                    if (check) {
                        await func.execute(arg);
                        return skip();
                    }
                }
            } catch (e) {
                return err(e);
            }
            return arg;
        },
    };
};
