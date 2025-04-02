import type { UserCredentialsRepository } from "@/repositories/user_credentials_repository";
import type { PasswordEncryptionProvider } from "@/providers/password_encryption";

import validator from 'validator';
import { InvalidAuthenticationMethodError, WrongLoginCredentialsError } from "@/errors/email_password_authentication";
import { AdapterUser } from "next-auth/adapters";

/**
 * A service that implements email-and-password authentication.
 **/
export class EmailAndPasswordAuthenticationProvider {
    private userEmailCredentialsRepository: UserCredentialsRepository
    private passwordEncryptionProvider: PasswordEncryptionProvider;

    /**
     * Logs a user in via email-and-password authentication.
     * 
     * @param email The email attached to the user.
     * @param password The password to check for authentication. Must be unencrypted when passed to the function.
     * 
     * @returns A promise that contains the authenticated user's data when resolved, or an error when rejected.
     */
    async loginUser(email: string, password: string): Promise<AdapterUser> {
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            throw new WrongLoginCredentialsError();
        }

        const credentials = await this.userEmailCredentialsRepository.getUserCredentialsByEmail(email);
        if (credentials === null) {
            throw new WrongLoginCredentialsError();
        }

        // Cannot authenticate via email-and-password if the user has not set a password.
        if (credentials.password === undefined) {
            throw new InvalidAuthenticationMethodError();
        }

        // Scenario where the user inputs an invalid password.
        if (!this.passwordEncryptionProvider.validate(password, credentials.password.encryptedValue)) {
            throw new WrongLoginCredentialsError();
        }

        return {
            id: credentials.id,
            email: credentials.email,
            emailVerified: credentials.emailVerified
        };
    }

    /**
     * Initializes the service
     * 
     * @param userEmailCredentialsRepository The user credentials repository to use for the service.
     * @param passwordEncryptionProvider The password encryption provider to use for the service.
     */
    constructor(
        userEmailCredentialsRepository: UserCredentialsRepository,
        passwordEncryptionProvider: PasswordEncryptionProvider
    )
    {
        this.userEmailCredentialsRepository = userEmailCredentialsRepository;
        this.passwordEncryptionProvider = passwordEncryptionProvider;
    }
}
