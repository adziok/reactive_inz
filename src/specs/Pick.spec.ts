import { Observable } from '../classes/Observable';
import { pick } from '../classes/operators';
import { sleep } from './utils';

describe('Pick operator', () => {
    it('Should pick first value which fulfilled rule', async () => {
        const observable = new Observable('test_value', 'second_value', 'third_value', 'second_value');
        const spy = jest.fn();

        observable.pipe(pick((v) => v === 'second_value')).subscribe(spy);

        await sleep(100);
        expect(spy).toBeCalledWith('second_value');
        expect(spy).toBeCalledTimes(1);
    });
});
