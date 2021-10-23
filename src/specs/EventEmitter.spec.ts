import { EventEmitter } from '../classes/EventEmitter';

describe('EventEmitter', () => {
    let eventEmitter: EventEmitter<any>;

    beforeEach(() => {
        eventEmitter = new EventEmitter<any>();
    });

    it('# Should allow to listen for events', () => {
        const cbMock = jest.fn();
        eventEmitter.on('data', cbMock);
        eventEmitter.emit('data', 'test');
        expect(cbMock).toHaveBeenCalledWith('test');
    });

    it('# Should allow to listen for event once and unsubscribe', () => {
        const cbMock = jest.fn();
        eventEmitter.once('data', cbMock);
        eventEmitter.emit('data', 'test');
        eventEmitter.emit('data', 'test');

        expect(cbMock).toBeCalledTimes(1);
    });

    it('# Should allow to emit events', () => {
        const cbMock = jest.fn();
        eventEmitter.on('data', cbMock);
        eventEmitter.emit('data', 'test');
        expect(cbMock).toHaveBeenCalledWith('test');
    });

    it('# Should allow to remove lister', () => {
        const cbMock = jest.fn();
        eventEmitter.on('data', cbMock);
        eventEmitter.emit('data', 'test');
        eventEmitter.removeListener('data', cbMock);
        eventEmitter.emit('data', 'test');

        expect(cbMock).toHaveBeenCalledWith('test');
        expect(cbMock).toBeCalledTimes(1);
    });
});
