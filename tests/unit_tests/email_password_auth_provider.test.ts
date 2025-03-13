import 'reflect-metadata';

import { EmailAndPasswordAuthenticationProvider } from "@/providers/email_and_password_authentication";

import { User, UserEmailCredentials } from "@/models/user";
import { UserRepository } from "@/repositories/user_repository";
import { UserEmailCredentialsRepository } from "@/repositories/user_email_credentials_repository";
import { PasswordEncryptionProvider } from "@/providers/password_encryption";

import { describe, expect, test, jest } from "@jest/globals";
import { UserIdProvider } from '@/providers/user_id';
import { EmailAlreadyInUseError, InvalidEmailFormat, MissingEmailError, MissingPasswordError, UserRegistrationError, WrongLoginCredentialsError } from '@/errors/email_password_authentication';
import { FailedToFetchDataError } from '@/errors/internal_errors';

const mockedUserRepository: UserRepository = {
    createUser: jest.fn<() => Promise<void>>(),
    getUserById: jest.fn<() => Promise<User | null>>(),
    updateUser: jest.fn<() => Promise<void>>(),
    deleteUser: jest.fn<() => Promise<void>>(),
};

const mockedUserEmailCredentialsRepository: UserEmailCredentialsRepository = {
    createUserCredentials: jest.fn<() => Promise<void>>(),
    getUserCredentialsByEmail: jest.fn<() => Promise<UserEmailCredentials | null>>(),
    getUserCredentialsById: jest.fn<() => Promise<UserEmailCredentials | null>>(),
    updateUserCredentials: jest.fn<() => Promise<void>>(),
    deleteUserCredentials: jest.fn<() => Promise<void>>(),
};

const mockedPasswordEncryptionProvider: PasswordEncryptionProvider = {
    encrypt: jest.fn<() => string>(),
    validate: jest.fn<() => boolean>()
};

const mockedUserIdProvider: UserIdProvider = {
    generate: jest.fn<() => string>()
};

describe("EmailAndPasswordAuthenticationProvider login", () => {
    test("should pass with matching credentials", async () => {
        (mockedUserRepository.getUserById as jest.Mock<() => Promise<User | null>>).mockResolvedValue({
            id: "test",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockResolvedValue({
            userId: "test",
            email: "test@example.com",
            password: "sampleText"
        });

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        (mockedPasswordEncryptionProvider.validate as jest.Mock<() => boolean>).mockReturnValue(true);

        await expect(service.loginUser("test@example.com", "sampleText")).resolves.toEqual({
            id: "test",
            firstName: "Lorem",
            lastName: "Ipsum"
        });
        expect(mockedPasswordEncryptionProvider.validate).toHaveBeenCalledWith("sampleText", "sampleText");
        expect(mockedUserEmailCredentialsRepository.getUserCredentialsByEmail).toHaveBeenCalledWith("test@example.com");
        expect(mockedUserRepository.getUserById).toHaveBeenCalledWith("test");
    });

    test("should fail with no email passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("", "test")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should fail with no password passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test", "")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should fail with wrong email", async () => {
        (mockedUserRepository.getUserById as jest.Mock<() => Promise<User | null>>).mockResolvedValue({
            id: "test",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockResolvedValue({
            userId: "test",
            email: "test@example.com",
            password: "sampleText"
        });

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test2@example.com", "sampleText")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should fail with wrong password", async () => {
        (mockedUserRepository.getUserById as jest.Mock<() => Promise<User>>).mockResolvedValue({
            id: "test",
            firstName: "Lorem",
            lastName: "Ipsum"
        });

        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials>>).mockResolvedValue({
            userId: "test",
            email: "test@example.com",
            password: "sampleText"
        });

        (mockedPasswordEncryptionProvider.validate as jest.Mock<() => boolean>).mockReturnValue(false);

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText2")).rejects.toThrow(new WrongLoginCredentialsError());
        expect(mockedPasswordEncryptionProvider.validate).toHaveBeenCalledWith("sampleText2", "sampleText");
    });

    test("should fail if credentials don't exist", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockResolvedValue(null);

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should throw if user credentials repository fails", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockRejectedValue(new FailedToFetchDataError());

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new FailedToFetchDataError());
    });

    test("should throw if user repository fails", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockResolvedValue({
            userId: "test",
            email: "test@example.com",
            password: "sampleText"
        });
        (mockedPasswordEncryptionProvider.validate as jest.Mock<() => boolean>).mockReturnValue(true);

        (mockedUserRepository.getUserById as jest.Mock<() => Promise<User | null>>).mockRejectedValue(new FailedToFetchDataError());

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new FailedToFetchDataError());
    });
});

describe("EmailAndPasswordAuthenticationProvider register", () => {
    const userToRegister: User = {
        firstName: "Lorem",
        lastName: "Ipsum"
    };

    test("should pass with valid data", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials>>).mockRejectedValue(new Error("User does not exist."));

        (mockedUserRepository.createUser as jest.Mock<() => Promise<void>>).mockResolvedValue();
        (mockedUserEmailCredentialsRepository.createUserCredentials as jest.Mock<() => Promise<void>>).mockResolvedValue();

        (mockedUserIdProvider.generate as jest.Mock<() => string>).mockReturnValue("420");
        (mockedPasswordEncryptionProvider.encrypt as jest.Mock<() => string>).mockReturnValue("encryptedPassword");

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        const expectedUser: User = {
            id: "420",
            firstName: "Lorem",
            lastName: "Ipsum"
        };

        await expect(service.registerUser(userToRegister, "test@example.com", "sampleText")).resolves.toEqual(expectedUser);
        expect(mockedUserIdProvider.generate).toHaveBeenCalled();
        expect(mockedPasswordEncryptionProvider.encrypt).toHaveBeenCalledWith("sampleText");
        expect(mockedUserRepository.createUser).toHaveBeenCalledWith(expectedUser);
        expect(mockedUserEmailCredentialsRepository.createUserCredentials).toHaveBeenCalledWith({
            userId: "420",
            email: "test@example.com",
            password: "encryptedPassword"
        });
    });

    test("should fail with invalid email format", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "test", "sampleText")).rejects.toThrow(new InvalidEmailFormat());
    });

    test("should fail with no email passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "", "sampleTest")).rejects.toThrow(new MissingEmailError());
    });

    test("should fail with no password passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "test@example.com", "")).rejects.toThrow(new MissingPasswordError());
    });

    test("should fail if email already in use", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials>>).mockResolvedValue({
            userId: "another-test",
            email: "test@example.com",
            password: "sampleText2"
        });
        
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "test@example.com", "sampleText")).rejects.toThrow(new EmailAlreadyInUseError());
    });

    test("should fail if user already has id", async () => {
        const testUser = userToRegister;
        testUser.id = "420";

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(testUser, "test@example.com", "sampleText")).rejects.toThrow(new UserRegistrationError("User already has id"));
    });

    test("should not register with repeated id", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials>>).mockRejectedValue(new Error("User does not exist."));

        (mockedUserRepository.createUser as jest.Mock<() => Promise<void>>).mockResolvedValue();
        (mockedUserEmailCredentialsRepository.createUserCredentials as jest.Mock<() => Promise<void>>).mockResolvedValue();

        (mockedUserIdProvider.generate as jest.Mock<() => string>).mockReturnValue("420");

        const secondUserToRegister: User = {
            firstName: "Sample",
            lastName: "Text"
        };

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = await service.registerUser(userToRegister, "test@example.com", "sampleText");

        let index = 0;

        (mockedUserIdProvider.generate as jest.Mock<() => string>).mockImplementation(() => String(420 + index++))

        await expect(service.registerUser(secondUserToRegister, "test2@example.com", "sampleText2")).resolves.toEqual({
            id: "421",
            firstName: "Sample",
            lastName: "Text"
        });
    });

    test("should throw if user credentials repository fails", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockRejectedValue(new FailedToFetchDataError());

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "test@example.com", "sampleText")).rejects.toThrow(new FailedToFetchDataError());
    });

    test("should throw if user repository fails", async () => {
        (mockedUserEmailCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserEmailCredentials | null>>).mockResolvedValue(null);
        (mockedUserIdProvider.generate as jest.Mock<() => string>).mockReturnValue("420");
        (mockedUserRepository.createUser as jest.Mock<() => Promise<void>>).mockRejectedValue(new FailedToFetchDataError());

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserRepository,
            mockedUserEmailCredentialsRepository,
            mockedPasswordEncryptionProvider,
            mockedUserIdProvider
        );

        await expect(() => service.registerUser(userToRegister, "test@example.com", "sampleText")).rejects.toThrow(new FailedToFetchDataError());
    });
});
