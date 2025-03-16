/**
 * The internal data structure for a user.
 */

export type AuthenticatedUser = {
    /**
     * The id of the user.
     **/
    id: string;
}

export type User = AuthenticatedUser & {
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
export type UserCredentials = {
    /**
     * The id of the user who owns the credentials.
     **/
    userId: string;

    /**
     * The email address of the user.
     **/
    email: string;

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
