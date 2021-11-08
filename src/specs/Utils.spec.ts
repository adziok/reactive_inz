import { curryPipes, PipeFunction } from '../classes/PipeExecutor';
import { ok, OkResult, PipeFunctionResult } from '../classes/PipeFunctionResult';

describe('Utils', () => {
    describe('CurryPipes', () => {
        it('should return initial value when pipes parameter is not provided', async () => {
            const result = await curryPipes()(ok(4));
            expect((result as OkResult<any, any>).value).toEqual(4);
        });

        it('should return mutated value when pipe mutable pipe is provided', async () => {
            const add2pipe: PipeFunction = {
                execute(result: PipeFunctionResult<any, any>): PipeFunctionResult<any, any> {
                    if (result.isOk()) {
                        return ok(result.value + 2);
                    }
                    return result;
                },
            };
            const result = await curryPipes(add2pipe)(ok(4));
            expect((result as OkResult<any, any>).value).toEqual(6);
        });
    });
});
