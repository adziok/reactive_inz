import { Observable } from '../classes/Observable';
import { sleep } from './utils';
import { map } from '../classes/operators';

describe('Map operator', () => {
    it('Have access to stream values', async () => {
        const observable = new Observable('test_value');
        const spy = jest.fn();

        observable
            .pipe(
                map((v) => {
                    return v;
                })
            )
            .subscribe(spy);

        await sleep(100);
        expect(spy).toBeCalledWith('test_value');
    });

    it('Should mutate stream values', async () => {
        const observable = new Observable('test_value');
        const spy = jest.fn();

        observable
            .pipe(
                map((v) => {
                    return 'other_value';
                })
            )
            .subscribe(spy);

        await sleep(100);
        expect(spy).toBeCalledWith('other_value');
    });

    it('Should catch error when map generate once', async () => {
        const observable = new Observable('test_value');
        const subscribeSpy = jest.fn();
        const errorSpy = jest.fn();

        observable
            .pipe(
                map((v) => {
                    throw new Error();
                })
            )
            .subscribe(subscribeSpy, errorSpy);

        await sleep(100);
        expect(subscribeSpy).not.toBeCalled();
        expect(errorSpy).toBeCalled();
    });
});
