import { FunctionReturning } from '../common/utils';
import { PipeFunction } from '../PipeExecutor';
import { PipeFunctionResult, skip } from '../PipeFunctionResult';

export const filter = (cb: FunctionReturning<boolean>): PipeFunction => {
    return {
        async execute(arg: PipeFunctionResult<any, any>): Promise<PipeFunctionResult<any, any>> {
            try {
                if (arg.isOk()) {
                    const shouldEmit = await cb(arg.value);
                    return (!shouldEmit && skip()) || arg;
                }
            } catch (e) {
                return skip();
            }
            return arg;
        },
    };
};
