import { EventEmitter } from './common/EventEmitter';
import { Subscribable } from '../interfaces/Subscribable';
import { Unsubscribable } from '../interfaces/Unsubscribable';
import { Observer } from './Observer';
import { PipeExecutor, PipeFunction } from './PipeExecutor';
import { PipeFunctionResult, PipeFunctionResultFactory } from './PipeFunctionResult';

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

    private async handleSubscribeEvent() {
        this.subscribed = true;

        while (this._source.length > 0) {
            const wrappedEventIntoResult = PipeFunctionResultFactory.create(this._source.shift());
            await this.emitNextEvent(wrappedEventIntoResult);
        }
    }

    private async emitNextEvent(nextWrappedEvent: PipeFunctionResult<T, Error>) {
        try {
            const result = await this.pipeExecutor.execute(nextWrappedEvent);

            if (result.isSkip()) {
                return;
            }
            if (result.isError()) {
                this.eventEmitter.emit('error', result.error);
            }
            if (result.isOk()) {
                this.eventEmitter.emit('next', result.value);
            }
            if (result.shouldClose()) {
                this.pending = false;
                this._source.length = 0;
                this.eventEmitter.emit('complete');
            }
        } catch (error) {
            this.eventEmitter.emit('error', error);
        }

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
