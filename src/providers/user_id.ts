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

export function getUserIdProvider(): UserIdProvider {
    return new CryptoUserIdProvider();
}
