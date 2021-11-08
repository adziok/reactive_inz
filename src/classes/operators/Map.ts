import { AnyFunction } from '../common/utils';
import { PipeFunction } from '../PipeExecutor';
import { err, ok, PipeFunctionResult } from '../PipeFunctionResult';

export const map = (cb: AnyFunction): PipeFunction => {
    return {
        async execute(arg: PipeFunctionResult<any, any>): Promise<PipeFunctionResult<any, any>> {
            try {
                if (arg.isOk()) {
                    return ok(await cb(arg.value));
                }
                return arg;
            } catch (e) {
                return err(e);
            }
        },
    };
};
