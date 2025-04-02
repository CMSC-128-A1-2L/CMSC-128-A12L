import { Types } from "mongoose";

/**
 * A service which handles user id generation.
 * 
 * This is turned into an interface for testability purposes.
 **/
export interface UserIdProvider {
    generate(): string;
}

class CryptoUserIdProvider implements UserIdProvider {
    generate(): string {
        return crypto.randomUUID();
    }
}

class OIDUserIdProvider implements UserIdProvider {
    generate(): string {
        return new Types.ObjectId().toString();
    }
}

export function getUserIdProvider(): UserIdProvider {
    return new OIDUserIdProvider();
}
