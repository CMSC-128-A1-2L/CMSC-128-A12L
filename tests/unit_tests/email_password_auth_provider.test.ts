import { EmailAndPasswordAuthenticationProvider } from "@/providers/email_and_password_authentication";

import { UserCredentials } from "@/models/user";
import { UserCredentialsRepository } from "@/repositories/user_credentials_repository";
import { PasswordEncryptionProvider } from "@/providers/password_encryption";

import { describe, expect, test, jest } from "@jest/globals";
import { InvalidAuthenticationMethodError, WrongLoginCredentialsError } from '@/errors/email_password_authentication';
import { FailedToFetchDataError } from '@/errors/internal_errors';
import { AdapterUser } from "next-auth/adapters";

const mockedUserCredentialsRepository: UserCredentialsRepository = {
    createUserCredentials: jest.fn<() => Promise<void>>(),
    getUserCredentialsByEmail: jest.fn<() => Promise<UserCredentials | null>>(),
    getUserCredentialsById: jest.fn<() => Promise<UserCredentials | null>>(),
    updateUserCredentials: jest.fn<() => Promise<void>>(),
    deleteUserCredentials: jest.fn<() => Promise<void>>(),
};

const mockedPasswordEncryptionProvider: PasswordEncryptionProvider = {
    encrypt: jest.fn<() => string>(),
    validate: jest.fn<() => boolean>()
};

describe("EmailAndPasswordAuthenticationProvider", () => {
    test("should pass with matching credentials", async () => {
        (mockedUserCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserCredentials | null>>).mockResolvedValue({
            id: "test",
            email: "test@example.com",
            emailVerified: null,
            password: "encryptedPassword"
        });

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        (mockedPasswordEncryptionProvider.validate as jest.Mock<() => boolean>).mockReturnValue(true);

        const expectedReturn: AdapterUser = {
            id: "test",
            email: "test@example.com",
            emailVerified: null
        };

        await expect(service.loginUser("test@example.com", "sampleText")).resolves.toEqual(expectedReturn);
        expect(mockedPasswordEncryptionProvider.validate).toHaveBeenCalledWith("sampleText", "encryptedPassword");
        expect(mockedUserCredentialsRepository.getUserCredentialsByEmail).toHaveBeenCalledWith("test@example.com");
    });

    test("should fail with no email passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("", "test")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should fail with no password passed", async () => {
        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("test@example.com", "")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should fail with wrong password", async () => {
        (mockedUserCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserCredentials>>).mockResolvedValue({
            id: "test",
            email: "test@example.com",
            emailVerified: null,
            password: "encryptedPassword"
        });

        (mockedPasswordEncryptionProvider.validate as jest.Mock<() => boolean>).mockReturnValue(false);

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText2")).rejects.toThrow(new WrongLoginCredentialsError());
        expect(mockedPasswordEncryptionProvider.validate).toHaveBeenCalledWith("sampleText2", "encryptedPassword");
    });

    test("should fail if credentials don't exist", async () => {
        (mockedUserCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserCredentials | null>>).mockResolvedValue(null);

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new WrongLoginCredentialsError());
    });

    test("should throw if user credentials repository fails", async () => {
        (mockedUserCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserCredentials | null>>).mockRejectedValue(new FailedToFetchDataError());

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new FailedToFetchDataError());
    });

    test("should fail if user does not have a password", async () => {
        (mockedUserCredentialsRepository.getUserCredentialsByEmail as jest.Mock<() => Promise<UserCredentials | null>>).mockResolvedValue({
            id: "test",
            emailVerified: null,
            email: "test@example.com"
        });

        const service = new EmailAndPasswordAuthenticationProvider(
            mockedUserCredentialsRepository,
            mockedPasswordEncryptionProvider
        );

        await expect(() => service.loginUser("test@example.com", "sampleText")).rejects.toThrow(new InvalidAuthenticationMethodError());
    })
});
