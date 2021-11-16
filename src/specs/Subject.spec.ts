import { Subject } from '../classes/Subject';
import { Observable } from '../classes/Observable';
import { sleep } from './utils';

describe('Subject', () => {
    describe('--> toObservable()', () => {
        it('# should return observable connected with subject', async () => {
            const subject = new Subject('test_value');

            const observable = subject.toObservable();

            expect(observable).toEqual(expect.any(Observable));
        });

        it('# observable should emit values provided in subject constructor', async () => {
            const [nextSpy, errorSpy, completeSpy] = [jest.fn(), jest.fn(), jest.fn()];
            const subject = new Subject('test_value');
            const observable = subject.toObservable();

            observable.subscribe(nextSpy, errorSpy, completeSpy);

            await sleep(100);

            expect(nextSpy).toBeCalledWith('test_value');
            expect(errorSpy).not.toBeCalled();
            expect(completeSpy).not.toBeCalled();
        });

        it('# observable should not emit values, errors or complete when subject constructor is empty', async () => {
            const [nextSpy, errorSpy, completeSpy] = [jest.fn(), jest.fn(), jest.fn()];
            const subject = new Subject();
            const observable = subject.toObservable();

            observable.subscribe(nextSpy, errorSpy, completeSpy);

            await sleep(100);

            expect(nextSpy).not.toBeCalled();
            expect(errorSpy).not.toBeCalled();
            expect(completeSpy).not.toBeCalled();
        });
    });

    describe('--> emit()', () => {
        it('# should emit new value if observable is subscribed', async () => {
            const spy = jest.fn();
            const subject = new Subject();

            const observable = subject.toObservable();
            observable.subscribe(spy);
            subject.emit('test_value');

            await sleep(100);

            expect(spy).toBeCalledWith('test_value');
        });

        it('# should emit new value if observable is subscribed and emit all values provided in constructor', async () => {
            const spy = jest.fn();
            const subject = new Subject('first_value');

            const observable = subject.toObservable();
            observable.subscribe(spy);
            subject.emit('second_value');

            await sleep(100);

            expect(spy).toHaveBeenNthCalledWith(1, 'first_value');
            expect(spy).toHaveBeenNthCalledWith(2, 'second_value');
        });
    });
});
