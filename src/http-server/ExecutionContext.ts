import { IncomingMessage, ServerResponse } from 'http';

export type IExecutionContext = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
    url: string;
    queryParams: Record<string, any>;
    headers: Record<string, any>;
    body?: Record<string, any>;
    request: IncomingMessage;
    response: ServerResponse;
    setStatus: (statusCode: number) => void;
    json: (response: Record<string, any> | string | number | Array<Record<string, any> | string | number>) => void;
    text: (text: string) => void;
};

export class ExecutionContext implements IExecutionContext {
    public headers: Record<string, any>;
    public method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
    public queryParams: Record<string, any>;
    public url: string;

    constructor(public request: IncomingMessage, public response: ServerResponse, public body?: Record<string, any>) {
        this.headers = request.headers;
        this.method = request.method as any;
        this.url = request.url as any;
        // implements query parameters
        this.queryParams = {};
    }

    json(response: Record<string, any> | string | number | Array<Record<string, any> | string | number>): void {
        this.response.writeHead(this.response.statusCode | 200, { 'Content-Type': 'application/json' });
        this.response.end(JSON.stringify(response));
    }

    setStatus(statusCode: number): void {
        this.response.writeHead(statusCode);
    }

    text(text: string): void {
        this.response.writeHead(this.response.statusCode | 200, { 'Content-Type': 'application/text' });
        this.response.end(text);
    }
}
