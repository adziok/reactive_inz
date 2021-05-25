import {Observable} from "../classes/Observable";

describe('Observable', () => {
    let observable: Observable<any>;

    beforeEach(() => {
        observable = new Observable<any>();
    });

    describe('--> subscribe() - Should allow to subscribe data', () => {
        it.todo('# should emit next value');
        it.todo('# should emit error');
        it.todo('# should emit complete after emitting all data');
        it.todo('# should allow to unsubscribe');
    });
})