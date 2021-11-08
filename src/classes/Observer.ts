import { EventEmitter } from './common/EventEmitter';
import { Unsubscribable } from '../interfaces/Unsubscribable';

interface ObserverConstructorParams<T> {
    next: (value: T) => void;
    eventEmitter: EventEmitter<'next' | 'error' | 'complete' | 'subscribe'>;
    error: (error: any) => void;
    complete: () => void;
}

export class Observer<T> implements Unsubscribable {
    constructor(private params: ObserverConstructorParams<T>) {
        params.next && params.eventEmitter.on('next', params.next);
        params.error && params.eventEmitter.on('error', params.error);
        params.complete && params.eventEmitter.on('complete', params.complete);
        params.eventEmitter.emit('subscribe');
    }

    unsubscribe(): void {
        this.params.next && this.params.eventEmitter.removeListener('next', this.params.next);
        this.params.error && this.params.eventEmitter.removeListener('error', this.params.error);
        this.params.complete && this.params.eventEmitter.removeListener('complete', this.params.complete);
    }
}
