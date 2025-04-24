/**
 * The internal data structure for a user.
 */

import { AlumniStatus } from "@/models/user";
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

    /**
     * The user's status.
     **/
    alumniStatus: AlumniStatus;
    
    /**
     * URL to the user's uploaded document (PDF).
     **/
    documentUrl?: string;

    /**
     * URL to the user's uploaded image.
     **/
    imageUrl?: string;

    /**
     * When the user was created.
     **/
    createdAt?: Date;

    /**
     * When the user was last updated.
     **/
    updatedAt?: Date;
};
