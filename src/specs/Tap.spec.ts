import { Observable } from '../classes/Observable';
import { tap } from '../classes/Tap';

describe('Tap operator', () => {
    it('Have access to stream values', () => {
        const observable = new Observable('test_value');
        const spy = jest.fn();

        observable.pipe(tap((v) => console.log(v))).subscribe(spy);

        expect(spy).toBeCalledWith('test_value');
    });

    it('Should not mutate stream values', () => {
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

        expect(spy).toBeCalledWith('test_value');
    });
});
// "@typescript-eslint/eslint-plugin": "^4.19.0",
//     "@typescript-eslint/parser": "^4.19.0",
//     "eslint": "^7.22.0",
