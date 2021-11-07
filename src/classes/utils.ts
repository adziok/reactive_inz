import { PipeFunction } from './Observable';

export const asyncForEach = async (elements: any[], callback: (el: any, i?: number, arr?: any[]) => void) => {
    for (let i = 0, l = elements.length; i !== l; ++i) {
        await callback.call(this, elements[i], i, elements);
    }
};

export type AnyFunction = (...args: any[]) => any | Promise<any>;

export const curryPipes = (...steps: PipeFunction[]) => async (initValue: any) => {
    let currentValue = await initValue;
    await asyncForEach(steps, async (fn) => {
        currentValue = await fn(currentValue);
    });

    return currentValue;
};
