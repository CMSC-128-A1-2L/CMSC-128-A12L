/**
 * The internal data structure for a user.
 */

import { AdapterUser } from "next-auth/adapters";

export enum UserRole {
    ALUMNI = "alumni",
    ADMIN = "admin",
    FACULTY = "faculty"
};

/**
 * The internal data structure for a user.
 **/
export interface User extends AdapterUser {
    /**
     * The user's role.
     **/
    role: UserRole[];
};

/**
 * The internal data structure for user credentials. These are used by the user for authentication.
 **/
export interface UserCredentials extends AdapterUser {
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

        /**
         * The refresh token assigned to the user's password auth account.
         **/
        refreshToken?: string;
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
