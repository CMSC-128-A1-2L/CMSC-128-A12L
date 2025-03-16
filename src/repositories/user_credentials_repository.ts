import { UserCredentials } from "@/models/user";

/**
 * The interface for a repository containing user credentials.
 **/
export interface UserCredentialsRepository {
    /**
     * Adds user credentials to the repository.
     *
     * @param userCredentials The credentials to add.
     * @return A promise that resolves when the credentials are added successfully.
     **/
    createUserCredentials(userCredentials: UserCredentials): Promise<void>;

    /**
     * Gets user credentials based on their email.
     * 
     * @param email The email to fetch.
     * @return A promise that resolves to either the fetched user credentials, or `null` if the credentials could not be
     *         found.
     */
    getUserCredentialsByEmail(email: string): Promise<UserCredentials | null>;

    /**
     * Gets user credentials based on their id.
     * 
     * @param id The user id to fetch.
     * @return A promise that resolves to either the fetched user credentials, or `null` if the credentials could not be
     *         found.
     **/
    getUserCredentialsById(id: string): Promise<UserCredentials | null>;

    /**
     * Updates user credentials on the repository. This will use the user id in the credentials to determine which entry
     * should be updated.
     * 
     * @param userCredentials The user credentials to update.
     * @return A promise that resolves when the credentials are updated successfully.
     */
    updateUserCredentials(userCredentials: UserCredentials): Promise<void>;

    /**
     * Deletes user credentials on the repository.
     * 
     * @param id The id of the user whose credentials are to be deleted.
     * @return A promise that resolves when the credentials are deleted successfully.
     */
    deleteUserCredentials(id: string): Promise<void>;
}

class InMemoryUserCredentialsRepository implements UserCredentialsRepository {
    private credentials: UserCredentials[];

    createUserCredentials(userCredentials: UserCredentials): Promise<void> {
        for (const user of this.credentials) {
            if (user.email === userCredentials.email || user.id === userCredentials.id) {
                return Promise.reject(new Error("The user already exists."));
            }
        }

        this.credentials.push(userCredentials);

        return Promise.resolve();
    }

    getUserCredentialsByEmail(email: string): Promise<UserCredentials | null> {
        for (const user of this.credentials) {
            if (user.email === email) {
                return Promise.resolve(user);
            }
        }

        return Promise.resolve(null);
    }

    getUserCredentialsById(id: string): Promise<UserCredentials | null> {
        for (const user of this.credentials) {
            if (user.id === id) {
                return Promise.resolve(user);
            }
        }

        return Promise.resolve(null);
    }

    updateUserCredentials(userCredentials: UserCredentials): Promise<void> {
        const index = this.credentials.findIndex(user => user.id === userCredentials.id);
        if (index === -1) {
            return Promise.reject(new Error("The user does not exist."));
        }

        this.credentials[index] = userCredentials;
        return Promise.resolve();
    }

    deleteUserCredentials(id: string): Promise<void> {
        const index = this.credentials.findIndex(credentials => credentials.id === id);
        if (index === -1) {
            return Promise.reject(new Error("The user does not exist."));
        }

        this.credentials.splice(index, 1);
        return Promise.resolve();
    }

    constructor() {
        this.credentials = [];
    }
}

const userCredentialsRepository = new InMemoryUserCredentialsRepository();
userCredentialsRepository.createUserCredentials({
    id: "test",
    email: "test@example.com",
    emailVerified: null,
    password: "Sample Text"
});

export function getUserCredentialRepository(): UserCredentialsRepository {
    return userCredentialsRepository;
}
