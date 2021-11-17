import { Observable } from './Observable';
import { PipeFunctionResultFactory } from './PipeFunctionResult';

class SubjectObservable<T> extends Observable<T> {
    static create<T>(initValues: T[] = []) {
        const instance = new SubjectObservable<T>(...initValues);
        instance.pending = true;
        return instance;
    }

    async emit(value: T) {
        const wrappedEventIntoResult = PipeFunctionResultFactory.create(value);
        await this.emitNextEvent(wrappedEventIntoResult);
    }
}

export class Subject<T> {
    private _source: T[];
    private _observables: SubjectObservable<T>[] = [];

    constructor(...args: T[]) {
        this._source = [...args];
    }

    toObservable(): Observable<T> {
        const observable = SubjectObservable.create<T>(this._source);
        this._observables.push(observable);
        return observable;
    }

    emit(value: T) {
        this._observables.forEach((observable) => observable.emit(value));
    }
}
