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
