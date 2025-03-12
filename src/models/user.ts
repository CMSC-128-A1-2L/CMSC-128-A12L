/**
 * The internal data structure for a user.
 */
export type User = {
    /**
     * A unique identifier for a user.
     * 
     * @todo Check if we need a better id data type like UUID.
     */
    id: string;

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
export type UserEmailCredentials = {
    /**
     * The id of the user who owns the credentials.
     **/
    userId: string;

    /**
     * The email address of the user.
     **/
    email: string;

    /**
     * The password of the user. MUST BE ENCRYPTED.
     **/
    password: string;
}
