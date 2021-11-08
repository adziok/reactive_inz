export type PipeFunctionResult<T, E> = OkResult<T, E> | ErrorResult<any, any> | SkipResult<any, any>;

export interface Result<T, E> {
    shouldEmitError(): boolean;
    shouldEmit(): boolean;
    isSkip(): boolean;
    isOk(): boolean;
    isError(): boolean;
}

export class OkResult<T, E> implements Result<T, E> {
    public constructor(public readonly value: T) {}

    public shouldEmitError(): this is OkResult<T, E> {
        return false;
    }

    public shouldEmit(): this is OkResult<T, E> {
        return true;
    }

    public isSkip(): this is OkResult<T, E> {
        return false;
    }

    public isOk(): this is OkResult<T, E> {
        return true;
    }

    public isError(): this is ErrorResult<T, E> {
        return false;
    }
}

export class ErrorResult<T, E> implements Result<T, E> {
    public constructor(public readonly error: E) {}

    public shouldEmitError(): this is OkResult<T, E> {
        return true;
    }

    public shouldEmit(): this is OkResult<T, E> {
        return false;
    }

    public isSkip(): this is OkResult<T, E> {
        return false;
    }

    public isOk(): this is OkResult<T, E> {
        return false;
    }

    public isError(): this is ErrorResult<T, E> {
        return true;
    }
}

export class SkipResult<T, E> implements Result<T, E> {
    public shouldEmitError(): this is OkResult<T, E> {
        return false;
    }

    public shouldEmit(): this is OkResult<T, E> {
        return false;
    }

    public isSkip(): this is OkResult<T, E> {
        return true;
    }

    public isOk(): this is OkResult<T, E> {
        return false;
    }

    public isError(): this is ErrorResult<T, E> {
        return false;
    }
}

export const skip = <T, E>(): SkipResult<T, E> => new SkipResult();

export const ok = <T, E>(value: T): OkResult<T, E> => new OkResult(value);

export const err = <T, E>(error: E): ErrorResult<T, E> => new ErrorResult(error);

export class PipeFunctionResultFactory {
    static create<T = any, E = any>(value: any | Error): PipeFunctionResult<T, E> {
        if (value instanceof Error) {
            return err(value);
        }
        return ok(value);
    }
}
