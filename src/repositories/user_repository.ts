import { User } from "@/models/user";
import { injectable } from "tsyringe";

/**
 * A repository for managing data of registered users.
 **/
export interface UserRepository {
    /**
     * Adds a new user to the repository.
     * 
     * @param user The user to add.
     * @returns A promise that is resolved when the user is added, or rejected if a problem occurs during registration
     *          like the user already existing.
     **/
    createUser(user: User): Promise<void>;

    /**
     * Gets a user from the repository.
     * 
     * @param id The id of the user to fetch.
     * @returns A promise that contains the fetched user when resolved, or rejected if a problem occurs during fetching
     *          like a user with the provided id not existing.
     **/
    getUserById(id: string): Promise<User>;

    /**
     * Updates an existing user in the repository.
     * 
     * @param user The user to update.
     * @returns A promise that is resolved when the user is updated, or rejected if a problem occurs during updating
     *          like a user with the provided id not existing.
     **/
    updateUser(user: User): Promise<void>;

    /**
     * Deletes a user from the repository.
     * 
     * @param id The id of the user to delete.
     * @returns A promise that is resolved when the user is deleted, or rejected if a problem occurs during deletion
     *          like a user with the provided id not existing.
     **/
    deleteUser(id: string): Promise<void>;
}

/**
 * A repository that stores user data in memory.
 **/
@injectable()
export class InMemoryUserRepository implements UserRepository {
    /**
     * The users stored in memory. Even though the `User` type already contains the id of the user, they are still
     * stored in a dictionary for faster access and updating.
     **/
    private users: { [id: string]: User } = {};

    createUser(user: User): Promise<void> {
        this.users[user.id] = user;

        return Promise.resolve();
    }

    getUserById(id: string): Promise<User> {
        let user = this.users[id];

        if (user === undefined) {
            return Promise.reject(new Error("User not found"));
        }

        return Promise.resolve(user);
    }

    updateUser(user: User): Promise<void> {
        if (this.users[user.id] === undefined) {
            return Promise.reject(new Error("User not found"));
        }

        this.users[user.id] = user;
        return Promise.resolve();
    }

    deleteUser(id: string): Promise<void> {
        if (this.users[id] === undefined) {
            return Promise.reject(new Error("User not found"));
        }

        delete this.users[id];
        return Promise.resolve();
    }

    constructor() {
        this.users = {};
    }
}
