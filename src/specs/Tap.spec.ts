import { Observable } from '../classes/Observable';
import { tap } from '../classes/Tap';
import { sleep } from './utils';

describe('Tap operator', () => {
    it('Have access to stream values', async () => {
        const observable = new Observable('test_value');
        const spy = jest.fn();

        observable.pipe(tap((v) => console.log(v))).subscribe(spy);

        await sleep(100);
        expect(spy).toBeCalledWith('test_value');
    });

    it('Should not mutate stream values', async () => {
        const observable = new Observable('test_value');
        const spy = jest.fn();

        observable
            .pipe(
                tap((v) => {
                    v = 4;
                    return 'other_value';
                })
            )
            .subscribe(spy);

        await sleep(100);
        expect(spy).toBeCalledWith('test_value');
    });
});
