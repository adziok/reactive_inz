import { curryPipes } from '../classes/common/utils';
import { PipeFunction } from '../classes/Observable';

describe('Utils', () => {
    describe('CurryPipes', () => {
        it('should return initial value when pipes parameter is not provided', async () => {
            const result = await curryPipes()(4);
            expect(result).toEqual(4);
        });

        it('should return mutated value when pipe mutable pipe is provided', async () => {
            const add2pipe: PipeFunction = {
                execute(value: any): any {
                    return value + 2;
                },
            };
            const result = await curryPipes(add2pipe)(4);
            expect(result).toEqual(6);
        });
    });
});
