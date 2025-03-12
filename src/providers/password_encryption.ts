import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

/**
 * A service which handles password encryption.
 * 
 * This is turned into an interface for testability purposes.
 **/
export interface PasswordEncryptionProvider {
    /**
     * Encrypts a password.
     * 
     * @param password The password to encrypt.
     * @returns The encrypted password.
     */
    encrypt(password: string): string;

    /**
     * Checks if the provided password corresponds to the encrypted password.
     * 
     * @param password The password to check.
     * @param encryptedPassword The target to check against.
     * @returns `true` if the passwords match, `false` otherwise.
     */
    validate(password: string, encryptedPassword: string): boolean;
}

/**
 * A service which uses bcrypt in order to encrypt passwords.
 * 
 * The app should use this when handling passwords. Other implementations of `PasswordEncryptionService` should only be
 * used for mocking purposes.
 **/
@injectable()
export class BcryptPasswordEncryptionProvider implements PasswordEncryptionProvider {
    encrypt(password: string): string {
        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync(password, salt);

        return encryptedPassword;
    }

    validate(password: string, encryptedPassword: string): boolean {
        return bcrypt.compareSync(password, encryptedPassword);
    }
}
