import { Observable } from '../classes/Observable';
import { emptyCb, sleep } from './utils';

describe('Observable', () => {
    describe('--> subscribe() - Should allow to subscribe data', () => {
        it('# should return object with Unsubscribable interface implemented', async () => {
            const observable = new Observable('test_value');

            const observer = observable.subscribe();

            await sleep(100);
            expect(observer.unsubscribe).toBeDefined();
        });

        it('# should emit values declared in constructor on first subscription attempt', async () => {
            const observable = new Observable('test_value');
            const spy = jest.fn();

            observable.subscribe(spy);

            await sleep(100);
            expect(spy).toBeCalledWith('test_value');
        });

        it('# should emit error when error when it occurred', async () => {
            const observable = new Observable(new Error('Ups...'));
            const spy = jest.fn();

            observable.subscribe(emptyCb, spy);

            await sleep(100);
            expect(spy).toBeCalledWith(expect.any(Error));
        });

        it('# should emit complete after emitting all data', async () => {
            const observable = new Observable('test_value');
            const spy = jest.fn();

            observable.subscribe(emptyCb, emptyCb, spy);

            await sleep(100);
            expect(spy).toBeCalled();
        });
    });
});
