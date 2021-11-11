export type PipeFunctionResult<T, E> = OkResult<T, E> | ErrorResult<T, E> | SkipResult<T, E>;

export interface Result<T, E> {
    shouldEmitError(): boolean;
    shouldEmit(): boolean;
    isSkip(): boolean;
    isOk(): boolean;
    isError(): boolean;
}

export function BaseResult<T, E>(
    shouldEmitError: boolean,
    shouldEmit: boolean,
    isSkip: boolean,
    isOk: boolean,
    isError: boolean
) {
    class BaseResultType {
        private _shouldClose: boolean;

        public andClose() {
            this._shouldClose = true;
            return this;
        }

        public shouldClose() {
            return this._shouldClose;
        }

        public shouldEmitError(): this is OkResult<T, E> {
            return shouldEmitError;
        }

        public shouldEmit(): this is OkResult<T, E> {
            return shouldEmit;
        }

        public isSkip(): this is OkResult<T, E> {
            return isSkip;
        }

        public isOk(): this is OkResult<T, E> {
            return isOk;
        }

        public isError(): this is ErrorResult<T, E> {
            return isError;
        }
    }
    return BaseResultType;
}

export class OkResult<T, E> extends BaseResult(false, true, false, true, false) {
    constructor(public value: T) {
        super();
    }
}

export class ErrorResult<T, E> extends BaseResult(true, false, false, false, true) {
    constructor(public error: E) {
        super();
    }
}

export class SkipResult<T, E> extends BaseResult(false, false, true, false, false) {}

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
