import { Observable } from '../classes/Observable';
import { sleep } from './utils';
import { bufferCount } from '../classes/operators';

describe('Buffer operator', () => {
    it('Should buffer 2 values and emit them together', async () => {
        const observable = new Observable<any>('test_value', 'test_value2');
        const nextSpy = jest.fn();

        observable.pipe(bufferCount(2)).subscribe(nextSpy);

        await sleep(100);
        expect(nextSpy).toBeCalledWith(['test_value', 'test_value2']);
        expect(nextSpy).toBeCalledTimes(1);
    });
});
