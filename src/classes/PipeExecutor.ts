import { asyncForEach } from './common/utils';
import { PipeFunctionResult } from './PipeFunctionResult';

export interface PipeFunction {
    execute(arg: any): PipeFunctionResult<any, any> | Promise<PipeFunctionResult<any, any>>;
}

export const curryPipes =
    (...steps: PipeFunction[]) =>
    async (initValue: PipeFunctionResult<any, any>): Promise<PipeFunctionResult<any, any>> => {
        let currentValue = await initValue;
        await asyncForEach(steps, async (step: PipeFunction) => {
            currentValue = await step.execute(currentValue);
        });
        return currentValue;
    };

export class PipeExecutor {
    private pipeFunctions: PipeFunction[] = [];

    add(pipeFunctions: PipeFunction[]) {
        this.pipeFunctions = [...this.pipeFunctions, ...pipeFunctions];
    }

    execute(value: any): Promise<PipeFunctionResult<any, any>> {
        if (!this.isIncludeAnyPipe()) {
            return value;
        }
        return curryPipes(...this.pipeFunctions)(value);
    }

    private isIncludeAnyPipe() {
        return this.pipeFunctions.length > 0;
    }
}
