import { cloneDeep } from 'lodash';

export const asyncForEach = async (elements: any[], callback: (el: any, i?: number, arr?: any[]) => void) => {
    for (let i = 0, l = elements.length; i !== l; ++i) {
        await callback.call(this, elements[i], i, elements);
    }
};

export type FunctionReturning<T> = (...args: any[]) => T | Promise<T>;
export type AnyFunction = FunctionReturning<any>;

export const deepClone = (obj: any) => cloneDeep(obj);
