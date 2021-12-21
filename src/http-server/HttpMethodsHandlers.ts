import { ExecutionContext } from './ExecutionContext';
import { ifDo, map } from '../classes/operators';

const isUrlAndHttpMethodEquals = (url: string, method: string) => (context: ExecutionContext) => {
    return context.url === url && context.method === method;
};

const baseRequestHandler = (httpMethod: string) => (url: string, callback: (context: ExecutionContext) => void) =>
    ifDo(
        isUrlAndHttpMethodEquals(url, httpMethod),
        map((context) => callback(context))
    );

export const handlePost = baseRequestHandler('POST');
export const handleGet = baseRequestHandler('GET');
export const handlePut = baseRequestHandler('PUT');
export const handlePath = baseRequestHandler('PATH');
export const handleDelete = baseRequestHandler('DELETE');
export const handleOptions = baseRequestHandler('OPTIONS');
