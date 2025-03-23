/**
 * The internal data structure for a user.
 */

import { AdapterUser } from "next-auth/adapters";

export enum UserRole {
    ALUMNI = 1 << 1,
    ADMIN = 1 << 2
};

export type User = AdapterUser & {
    bio: string;
    gender: string;
    role: UserRole;
    contactNumbers: string[];
};

/**
 * The internal data structure for user credentials. These are used by the user for authentication.
 **/
export type UserCredentials = AdapterUser & {
    /**
     * The credentials of the user for password authentication. If `undefined`, the user does not have password
     * authentication enabled.
     **/
    password?: {
        /**
         * The account ID of the user's password auth account.
         **/
        id: string;

        /**
         * The user's password, in encrypted form.
         **/
        encryptedValue: string;
    };

    /**
     * The credentials of the user for Google OAuth. If `undefined`, the user does not have Google authentication
     * enabled.
     **/
    google?: {
        /**
         * The account ID of the user's Google OAuth account.
         **/
        id: string;

        /**
         * The refresh token assigned by Google for the user's account.
         **/
        refreshToken: string;
    }
}
