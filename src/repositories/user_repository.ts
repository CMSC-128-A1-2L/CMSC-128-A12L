import { User } from "@/models/user";

/**
 * A repository for managing data of registered users.
 **/
export interface UserRepository {
    /**
     * Adds a new user to the repository.
     * 
     * @param user The user to add.
     * @returns A promise that is resolved when the user is added successfully.
     **/
    createUser(user: User): Promise<void>;

    /**
     * Gets a user from the repository.
     * 
     * @param id The id of the user to fetch.
     * @returns A promise that resolves to either the fetched user or `null` if the user does not exist.
     **/
    getUserById(id: string): Promise<User | null>;

    /**
     * Gets a user from the repository.
     * 
     * @param email The email of the user to fetch.
     * @returns A promise that resolves to either the fetched user or `null` if the user does not exist.
     */
    getUserByEmail(email: string): Promise<User | null>;

    /**
     * Updates an existing user in the repository.
     * 
     * @param user The user to update.
     * @returns A promise that is resolved when the user is updated successfully.
     **/
    updateUser(user: User): Promise<void>;

    /**
     * Deletes a user from the repository.
     * 
     * @param id The id of the user to delete.
     * @returns A promise that is resolved when the user is deleted successfully
     **/
    deleteUser(id: string): Promise<void>;
}

/**
 * A repository that stores user data in memory.
 **/
class InMemoryUserRepository implements UserRepository {
    /**
     * The users stored in memory. Even though the `User` type already contains the id of the user, they are still
     * stored in a dictionary for faster access and updating.
     **/
    private users: { [id: string]: User } = {};

    createUser(user: User): Promise<void> {
        if (user.id === undefined) {
            return Promise.reject(new Error("Cannot add user with no id"));
        }
        this.users[user.id] = user;

        return Promise.resolve();
    }

    getUserById(id: string): Promise<User | null> {
        const user = this.users[id];

        if (user === undefined) {
            return Promise.resolve(null);
        }

        return Promise.resolve(user);
    }

    getUserByEmail(email: string): Promise<User | null> {
        for (const user of Object.values(this.users)) {
            if (user.email === email) {
                return Promise.resolve(user);
            }
        }

        return Promise.resolve(null);
    }

    updateUser(user: User): Promise<void> {
        if (user.id === undefined || this.users[user.id] === undefined) {
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

const userRepository = new InMemoryUserRepository();

export function getUserRepository(): UserRepository {
    return userRepository;
}

