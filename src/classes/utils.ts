export const asyncForEach = async (elements: any[], callback: (el: any, i?: number, arr?: any[]) => void) => {
    for (let i = 0, l = elements.length; i !== l; ++i) {
        await callback.call(this, elements[i], i, elements);
    }
};

type AnyFunction = (...args: any[]) => any | Promise<any>;

export const curry = (...steps: AnyFunction[]) => async (initValue: any) => {
    let currentValue = await initValue;
    // tslint:disable-next-line: prefer-for-of
    await asyncForEach(steps, async (fn) => {
        currentValue = await fn(currentValue);
    });

    return currentValue;
};

const awaiter = async (v: any) => await v;
