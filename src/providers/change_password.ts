import { ChangePasswordVerifierRepository } from "@/repositories/change_password_verifier_repository";
import { PasswordEncryptionProvider } from "./password_encryption";
import { UserCredentialsRepository } from "@/repositories/user_credentials_repository";

export interface IChangePasswordService {
    /**
     * Initiates the password change for a user who isn't currently signed in. This should be used for "Forgot password"
     * features and can be skipped for a user who is currently signed in.
     * 
     * @param userId The id of the user attempting the password change.
     */
    // initiatePasswordChange(userId: string): Promise<void>;

    /**
     * Verifies a password change for a user who isn't currently signed in. This should be used for "Forgot password"
     * features and can be skipped for a user who is currently signed in.
     * 
     * @param userId The id of the user attempting the password change.
     * @param secret The secret used to verify the password change.
     */
    // verifyPasswordChange(userId: string, secret: string): Promise<boolean>;

    /**
     * Finalizes a user's password change attempt.
     * 
     * @param userId The id of the user whose password is being changed.
     * @param newPassword The new password of the user.
     */
    finalizePasswordChange(userId: string, newPassword: string): Promise<void>;
}

export class ChangePasswordService implements IChangePasswordService {
    private _encryptionProvider: PasswordEncryptionProvider;
    private _verifierRepository: ChangePasswordVerifierRepository;
    private _userCredentialsRepository: UserCredentialsRepository;

    async finalizePasswordChange(userId: string, newPassword: string): Promise<void>
    {
        const encryptedPassword = this._encryptionProvider.encrypt(newPassword);
        const userCredentials = await this._userCredentialsRepository.getUserCredentialsById(userId);
        if (userCredentials === null) {
            throw new Error("Cannot change password of non-existent user.");
        }

        if (userCredentials.password) {
            userCredentials.password.encryptedValue = encryptedPassword;
        } else {
            userCredentials.password = {
                id: crypto.randomUUID(),
                encryptedValue: encryptedPassword,
                sessionExpiry: new Date()
            };
        }

        await this._userCredentialsRepository.updateUserCredentials(userCredentials);
    }

    constructor(
        encryptionProvider: PasswordEncryptionProvider,
        verifierRepository: ChangePasswordVerifierRepository,
        userCredentialsRepository: UserCredentialsRepository
    ) {
        this._encryptionProvider = encryptionProvider;
        this._verifierRepository = verifierRepository;
        this._userCredentialsRepository = userCredentialsRepository;
    }
}