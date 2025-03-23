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
