import { AnyFunction } from '../common/utils';
import { PipeFunction } from '../PipeExecutor';
import { err, PipeFunctionResult } from '../PipeFunctionResult';

export const catchError = (cb: AnyFunction): PipeFunction => {
    return {
        async execute(arg: PipeFunctionResult<any, any>): Promise<PipeFunctionResult<any, any>> {
            try {
                if (arg.isError()) {
                    await cb(arg.error);
                }
            } catch (e) {
                return err(e);
            }
            return arg;
        },
    };
};
