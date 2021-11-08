import { Observable } from '../classes/Observable';
import { sleep } from './utils';
import { filter } from '../classes/operators';

describe('Filter operator', () => {
    it('Should filter values', async () => {
        const observable = new Observable('test_value', 'not_expected_value');
        const subscribeSpy = jest.fn();
        const errorSpy = jest.fn();

        observable.pipe(filter((v) => v === 'test_value')).subscribe(subscribeSpy, errorSpy);

        await sleep(100);
        expect(subscribeSpy).toHaveBeenCalledTimes(1);
        expect(subscribeSpy).toBeCalledWith('test_value');
        expect(errorSpy).not.toBeCalled();
    });
});
