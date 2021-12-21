import { createServer } from 'http';
import { Subject } from '../classes/Subject';
import { ExecutionContext } from './ExecutionContext';

export const createReactiveServer = () => {
    const serverSubject = new Subject<ExecutionContext>();

    const server = createServer(async (req, res) => {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk);
        }

        const data = Buffer.concat(buffers).toString() || '{}';
        const body = JSON.parse(data);

        serverSubject.emit(new ExecutionContext(req, res, body));
    });

    const serverObservable = serverSubject.toObservable();

    return {
        listen: (port: number) => {
            server.listen(port);
            console.log(`Server listen on port ${port}`);
            return serverObservable;
        },
    };
};
