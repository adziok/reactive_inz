import { EventEmitter } from './common/EventEmitter';
import { Subscribable } from '../interfaces/Subscribable';
import { Unsubscribable } from '../interfaces/Unsubscribable';
import { Observer } from './Observer';
import { PipeExecutor, PipeFunction } from './PipeExecutor';
import { PipeFunctionResult, PipeFunctionResultFactory } from './PipeFunctionResult';

export class Observable<T> implements Subscribable {
    protected subscribed = false;
    private eventEmitter = new EventEmitter<'next' | 'error' | 'complete' | 'subscribe'>();
    protected pending = false;
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

    protected async emitNextEvent(nextWrappedEvent: PipeFunctionResult<T, Error>) {
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
}
