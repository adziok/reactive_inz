import { EventEmitter } from './EventEmitter';
import { Subscribable } from '../interfaces/Subscribable';
import { Unsubscribable } from '../interfaces/Unsubscribable';
import { Observer } from './Observer';
import { curryPipes } from './utils';

export interface PipeFunction<A = any, R = any> {
    execute(arg: A): R;
}

class PipeExecutor {
    private pipeFunctions: PipeFunction[] = [];

    add(pipeFunctions: PipeFunction[]) {
        this.pipeFunctions = [...this.pipeFunctions, ...pipeFunctions];
    }

    execute(value: any) {
        if (!this.isIncludeAnyPipe()) {
            return value;
        }
        return curryPipes(...this.pipeFunctions)(value);
    }

    private isIncludeAnyPipe() {
        return this.pipeFunctions.length > 0;
    }
}

export class Observable<T> implements Subscribable {
    private subscribed = false;
    private eventEmitter = new EventEmitter<'next' | 'error' | 'complete' | 'subscribe'>();
    private pending = false;
    private _source: T[];
    private pipeExecutor = new PipeExecutor();

    constructor(...args: T[]) {
        this._source = [...args];

        this.eventEmitter.once('subscribe', () => this.handleSubscribeEvent());
    }

    public subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable {
        return new Observer({ next, error, complete, eventEmitter: this.eventEmitter });
    }

    public pipe(...pipelines: PipeFunction[]): Observable<T> {
        this.pipeExecutor.add(pipelines);
        return this;
    }

    /**
     * Call when Observer start subscribing data source
     *
     * @private
     * @memberof Observable
     */
    private async handleSubscribeEvent() {
        this.subscribed = true;

        while (this._source.length > 0) {
            await this.emitNextEvent(this._source.shift());
        }
    }

    private emitNextEvent(nextEvent: T | Error) {
        const value = this.pipeExecutor.execute(nextEvent);
        this.eventEmitter.emit((value instanceof Error && 'error') || 'next', value);

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
