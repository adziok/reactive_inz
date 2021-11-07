import { Observable } from '../classes/Observable';
import { emptyCb } from './utils';

describe('Observable', () => {
    describe('--> subscribe() - Should allow to subscribe data', () => {
        it('# should return object with Unsubscribable interface implemented', () => {
            const observable = new Observable('test_value');

            const observer = observable.subscribe();

            expect(observer.unsubscribe).toBeDefined();
        });

        it.only('# should emit values declared in constructor on first subscription attempt', () => {
            const observable = new Observable('test_value');
            const spy = jest.fn();

            observable.subscribe(spy);

            expect(spy).toBeCalledWith('test_value');
        });

        it('# should emit error when error when it occurred', () => {
            const observable = new Observable(new Error('Ups...'));
            const spy = jest.fn();

            observable.subscribe(emptyCb, spy);

            expect(spy).toBeCalledWith(expect.any(Error));
        });

        it('# should emit complete after emitting all data', () => {
            const observable = new Observable('test_value');
            const spy = jest.fn();

            observable.subscribe(emptyCb, emptyCb, spy);

            expect(spy).toBeCalled();
        });
    });
});
