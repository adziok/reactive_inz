import { PipeFunction } from '../Observable';
import { cloneDeep } from 'lodash';

export const asyncForEach = async (elements: any[], callback: (el: any, i?: number, arr?: any[]) => void) => {
    for (let i = 0, l = elements.length; i !== l; ++i) {
        await callback.call(this, elements[i], i, elements);
    }
};

export type AnyFunction = (...args: any[]) => any | Promise<any>;

export const curryPipes =
    (...steps: PipeFunction[]) =>
    async (initValue: any) => {
        let currentValue = await initValue;
        await asyncForEach(steps, async (step: PipeFunction) => {
            currentValue = await step.execute(currentValue);
        });
        return currentValue;
    };

export const deepClone = (obj: any) => cloneDeep(obj);
