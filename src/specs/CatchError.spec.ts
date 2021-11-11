import { Observable } from '../classes/Observable';
import { sleep } from './utils';
import { catchError } from '../classes/operators';

describe('CatchError operator', () => {
    it('Should pick first value which fulfilled rule', async () => {
        const observable = new Observable<any>('test_value', new Error('????'));
        const tryCatchSpy = jest.fn();
        const errorSpy = jest.fn();
        const nextSpy = jest.fn();

        observable.pipe(catchError(tryCatchSpy)).subscribe(nextSpy, errorSpy);

        await sleep(100);
        expect(nextSpy).toBeCalledWith('test_value');
        expect(nextSpy).toBeCalledTimes(1);
        expect(errorSpy).toBeCalledTimes(1);
        expect(errorSpy).toBeCalledWith(expect.any(Error));
        expect(tryCatchSpy).toBeCalledTimes(1);
        expect(tryCatchSpy).toBeCalledWith(expect.any(Error));
    });
});
