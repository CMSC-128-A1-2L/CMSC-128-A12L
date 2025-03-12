import { User } from "@/models/user";
import type { UserEmailCredentialsRepository } from "@/repositories/user_email_credentials_repository";
import type { UserRepository } from "@/repositories/user_repository";
import type { PasswordEncryptionProvider } from "@/providers/password_encryption";

import { inject, injectable } from "tsyringe";

/**
 * A service that implements email-and-password authentication.
 **/
@injectable()
export class EmailAndPasswordAuthenticationProvider {
    private userRepository: UserRepository;
    private userEmailCredentialsRepository: UserEmailCredentialsRepository
    private passwordEncryptionService: PasswordEncryptionProvider;

    /**
     * Registers a user via email-and-password authentication.
     * 
     * @param user The user to register.
     * @param email The email to attach to the user.
     * @param password The password that the user will use for authentication. Must be unencrypted when passed to the
     *                 function.
     * 
     * @returns A promise that contains the registered user when resolved, or an error when rejected.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async registerUser(user: User, email: string, password: string): Promise<User> {
        throw new Error("Not yet implemented");
    }

    /**
     * Logs a user in via email-and-password authentication.
     * 
     * @param email The email attached to the user.
     * @param password The password to check for authentication. Must be unencrypted when passed to the function.
     * 
     * @returns A promise that contains the authenticated user's data when resolved, or an error when rejected.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async loginUser(email: string, password: string): Promise<User> {
        throw new Error("Not yet implemented");
    }

    /**
     * Initializes the service
     * 
     * @param userRepository The user repository to use for the service.
     * @param userEmailCredentialsRepository The user credentials repository to use for the service.
     */
    constructor(
        @inject("UserRepository") userRepository: UserRepository,
        @inject("UserEmailCredentialsRepository") userEmailCredentialsRepository: UserEmailCredentialsRepository,
        @inject("PasswordEncryptionService") passwordEncryptionService: PasswordEncryptionProvider
    )
    {
        this.userRepository = userRepository;
        this.userEmailCredentialsRepository = userEmailCredentialsRepository;
        this.passwordEncryptionService = passwordEncryptionService;
    }
}
