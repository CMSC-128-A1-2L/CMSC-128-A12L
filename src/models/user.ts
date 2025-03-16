/**
 * The internal data structure for a user.
 */

import { AdapterUser } from "next-auth/adapters";

export type User = AdapterUser & {
    /**
     * The first name of the user.
     **/
    firstName: string;

    /**
     * The middle name of the user.
     **/
    middleName?: string;

    /**
     * The last name of the user.
     **/
    lastName: string;
};

/**
 * The internal data structure for user credentials. These are used by the user for authentication.
 **/
export type UserCredentials = AdapterUser & {
    /**
     * The password of the user. If `undefined`, the user has not set a password.
     * 
     * MUST BE ENCRYPTED.
     **/
    password?: string;

    /**
     * The refresh token of a user authenticated via Google OAuth. If `undefined`, the user has not linked a Google account.
     **/
    googleRefreshToken?: string;
}
