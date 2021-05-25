import {EventEmitter} from './EventEmitter';
import {Subscribable} from "../interfaces/Subscribable";
// import { ObservableWithPipes } from './ObservableWithPipe';
// import { Subscribable } from './types/Subscribable';
// import { Unsubscribable } from './types/Unsubscribable';
// import { Observer } from './Observer';
// import { PipelineOperator } from './types/PipelinesOperators';

interface ObserverConstructorParams<T> {
    next: (value: T) => void;
    eventEmitter: EventEmitter<"next" | "error" | "complete" | "subscribe">;
    error: (error: any) => void;
    complete: () => void;
}

interface Unsubscribable {
    unsubscribe(): void;
}

class Observer<T> implements Unsubscribable {
    constructor(param: ObserverConstructorParams<T>) {}

    unsubscribe(): void {
    }
}

export class Observable<T> implements Subscribable {
    private subscribed = false;
    private eventEmitter = new EventEmitter<'next' | 'error' | 'complete' | 'subscribe'>();
    private pending = false;
    private _source: T[];

    constructor(...args: T[]) {
        this._source = [...args];

        this.eventEmitter.once('subscribe', () => this.handleSubscribeEvent());
    }

    public subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable {
        return new Observer({next, error, complete, eventEmitter: this.eventEmitter});
    }

    // public pipe(...pipelines: PipelineOperator<T>[]): Subscribable<T> {
    //     return new ObservableWithPipes(this.eventEmitter, pipelines);
    // }

    /**
     * Call when Observer start subscribing data source
     *
     * @private
     * @memberof Observable
     */
    private handleSubscribeEvent() {
        this.subscribed = true;

        while (this._source.length > 0) {
            this.emitNextEvent(this._source.shift());
        }
    }

    private emitNextEvent(nextEvent: T | Error) {
        this.eventEmitter.emit(nextEvent instanceof Error && 'error' || 'next', nextEvent);

        if (!this.pending && this._source.length === 0) {
            this.eventEmitter.emit('complete');
        }
    }

    // /**
    //  * @internal
    //  *
    //  * Internal method to close Observable fromSubject
    //  * Method emit complete event and remove EventEmiiter listners
    //  *
    //  * @private
    //  * @returns
    //  * @memberof Observable
    //  */
    // private close() {
    //     return () => {
    //         this.pending = false;
    //         this.eventEmitter.emit('complete');
    //         this.eventEmitter.removeAllListeners();
    //     };
    // }

    // /**
    //  * @internal
    //  *
    //  * Internal method to commuinicate Subject with subscribe and allow to emit new data for observers
    //  * If subscribed is false pushing data to array of events
    //  * Else emit data by EventEmmiter
    //  *
    //  * @private
    //  * @memberof Observable
    //  */
    // private pushEvent() {
    //     return (val: T) => {
    //         this.eventEmitter.emit('next', val);
    //     };
    // }

    // static create<T>(dataSource: T[]) {
    //     const observable = new Observable<T>(...dataSource);
    //     observable.pending = true;

    //     return {
    //         next: observable.pushEvent(),
    //         close: observable.close(),
    //         observable
    //     };
    // }
}
