import { User } from "@/models/user";
import type { UserEmailCredentialsRepository } from "@/repositories/user_email_credentials_repository";
import type { UserRepository } from "@/repositories/user_repository";
import type { PasswordEncryptionProvider } from "@/providers/password_encryption";
import type { UserIdProvider } from "@/providers/user_id";

import validator from 'validator';
import { EmailAlreadyInUseError, InvalidEmailFormat, MissingEmailError, MissingPasswordError, UserRegistrationError, WrongLoginCredentialsError } from "@/errors/email_password_authentication";
import { InconsistentInternalStateError } from "@/errors/internal_errors";

/**
 * A service that implements email-and-password authentication.
 **/
export class EmailAndPasswordAuthenticationProvider {
    private userRepository: UserRepository;
    private userEmailCredentialsRepository: UserEmailCredentialsRepository
    private passwordEncryptionProvider: PasswordEncryptionProvider;
    private userIdProvider: UserIdProvider

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
    async registerUser(user: User, email: string, password: string): Promise<User> {
        if (validator.isEmpty(email)) {
            throw new MissingEmailError();
        }

        if (validator.isEmpty(password)) {
            throw new MissingPasswordError();
        }

        if (!validator.isEmail(email)) {
            throw new InvalidEmailFormat();
        }

        if (user.id !== undefined) {
            throw new UserRegistrationError("User already has id");
        }

        const existingUserCredentials = await this.userEmailCredentialsRepository.getUserCredentialsByEmail(email);
        if (existingUserCredentials !== null) {
            throw new EmailAlreadyInUseError();
        }

        const encryptedPassword = this.passwordEncryptionProvider.encrypt(password);

        const userToRegister = user;
        userToRegister.id = this.userIdProvider.generate();
        while (await this.userRepository.getUserById(userToRegister.id) !== null) {
            userToRegister.id = this.userIdProvider.generate();
        }

        await Promise.all([
            this.userEmailCredentialsRepository.createUserCredentials({
                userId: userToRegister.id,
                email: email,
                password: encryptedPassword
            }),
            this.userRepository.createUser(userToRegister)
        ]);

        return userToRegister;
    }

    /**
     * Logs a user in via email-and-password authentication.
     * 
     * @param email The email attached to the user.
     * @param password The password to check for authentication. Must be unencrypted when passed to the function.
     * 
     * @returns A promise that contains the authenticated user's data when resolved, or an error when rejected.
     */
    async loginUser(email: string, password: string): Promise<User> {
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            throw new WrongLoginCredentialsError();
        }

        const credentials = await this.userEmailCredentialsRepository.getUserCredentialsByEmail(email);
        if (credentials === null) {
            throw new WrongLoginCredentialsError();
        }

        if (!this.passwordEncryptionProvider.validate(password, credentials.password)) {
            throw new WrongLoginCredentialsError();
        }

        const user = await this.userRepository.getUserById(credentials.userId);
        if (user === null) {
            // If, somehow, the user credentials repository and user repository have inconsistent states on
            // which users are registered, throw an error.
            // This, ideally, should never happen, which is why this branch is not being tested.
            throw new InconsistentInternalStateError("User with valid credentials not in user repository");
        }

        return user;
    }

    /**
     * Initializes the service
     * 
     * @param userRepository The user repository to use for the service.
     * @param userEmailCredentialsRepository The user credentials repository to use for the service.
     * @param passwordEncryptionProvider The password encryption provider to use for the service.
     * @param userIdProvider The user id provider to use for the service.
     */
    constructor(
        userRepository: UserRepository,
        userEmailCredentialsRepository: UserEmailCredentialsRepository,
        passwordEncryptionProvider: PasswordEncryptionProvider,
        userIdProvider: UserIdProvider
    )
    {
        this.userRepository = userRepository;
        this.userEmailCredentialsRepository = userEmailCredentialsRepository;
        this.passwordEncryptionProvider = passwordEncryptionProvider;
        this.userIdProvider = userIdProvider;
    }
}
