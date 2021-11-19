import { PipeFunction } from '../PipeExecutor';
import { ok, PipeFunctionResult, skip } from '../PipeFunctionResult';

export const bufferCount = (capacity: number): PipeFunction => {
    const buffer: any[] = [];
    return {
        execute(
            arg: PipeFunctionResult<any, any>
        ): Promise<PipeFunctionResult<any, any>> | PipeFunctionResult<any, any> {
            if (arg.isOk()) {
                buffer.push(arg.value);
                if (buffer.length === capacity) {
                    const bufferCopy = [...buffer];
                    buffer.length = 0;
                    return ok(bufferCopy);
                }
            }
            return skip();
        },
    };
};
