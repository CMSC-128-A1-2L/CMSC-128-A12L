import { AdapterUser } from "next-auth/adapters";

/**
 * The internal data structure for user credentials. These are used by the user for authentication.
 **/
export interface UserCredentials {
    /**
     * The id of the user who owns the credentials.
     **/
    id: string;

    /**
     * The email of the user who owns the credentials.
     **/
    email: string;

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
        sessionExpiry: Date;
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
