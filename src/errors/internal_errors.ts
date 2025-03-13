export class InternalError extends Error {
    constructor(reason: string) {
        super(`Internal error: ${reason}`);
    }
}

export class FailedToFetchDataError extends InternalError {
    constructor() {
        super("Failed to fetch data");
    }
}
