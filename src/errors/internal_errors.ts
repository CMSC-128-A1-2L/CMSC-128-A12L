export class InternalError extends Error {
    constructor(reason: string) {
        super(`${reason}`);
        this.name = "InternalError";
    }
}

export class FailedToFetchDataError extends InternalError {
    constructor() {
        super("Failed to fetch data");
        this.name = "FailedToFetchDataError";
    }
}

export class InconsistentInternalStateError extends InternalError {
    constructor(reason: string) {
        super(`Inconsistent internal state: ${reason}`);
        this.name = "InconsistentInternalStateError";
    }
}
