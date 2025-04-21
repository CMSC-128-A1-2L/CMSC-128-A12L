import { connectDB } from "@/databases/mongodb";
import { UserCredentials } from "@/entities/user_credentials";
import { mapUserCredentialsDtoToUserCredentials, mapUserCredentialsToUserCredentialsDto } from "@/mappers/user_credentials";
import { UserCredentialsDto, UserCredentialsSchema } from "@/models/user_credentials";
import { Connection, Model } from "mongoose";
import { compare } from "bcrypt";

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
     * Gets user credentials based on their provider and provider account id.
     * 
     * @param provider The provider to fetch.
     * @param providerAccountId The provider account id to fetch.
     * @return A promise that resolves to either the fetched user credentials, or `null` if the credentials could not be
     *         found.
     **/
    getUserCredentialsByProvider(provider: string, providerAccountId: string): Promise<UserCredentials | null>;

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

    /**
     * Validates user credentials.
     * 
     * @param email The email of the user.
     * @param password The password of the user.
     * @return A promise that resolves to a boolean value indicating whether the credentials are valid.
     */
    validateUserCredentials(email: string, password: string): Promise<boolean>;
}

class MongoDbUserCredentialsRepository implements UserCredentialsRepository {
    private connection: Connection;
    private model: Model<UserCredentialsDto>;

    async createUserCredentials(userCredentials: UserCredentials): Promise<void> {
        const userCredentialsDto = mapUserCredentialsToUserCredentialsDto(userCredentials);
        await this.model.create(userCredentialsDto);
    }

    async getUserCredentialsByEmail(email: string): Promise<UserCredentials | null> {
        const userCredentialsDto = await this.model.findOne({ email: email });
        return userCredentialsDto ? mapUserCredentialsDtoToUserCredentials(userCredentialsDto) : null;
    }

    async getUserCredentialsById(id: string): Promise<UserCredentials | null> {
        const userCredentialsDto = await this.model.findOne({ id: id });
        return userCredentialsDto ? mapUserCredentialsDtoToUserCredentials(userCredentialsDto) : null;
    }

    async getUserCredentialsByProvider(provider: string, providerAccountId: string): Promise<UserCredentials | null> {
        const userCredentialsDto = await this.model.findOne({ [`${provider}.id`]: providerAccountId });
        return userCredentialsDto ? mapUserCredentialsDtoToUserCredentials(userCredentialsDto) : null;
    }

    async updateUserCredentials(userCredentials: UserCredentials): Promise<void> {
        const userCredentialsDto = mapUserCredentialsToUserCredentialsDto(userCredentials);
        await this.model.updateOne({ id: userCredentials.id }, userCredentialsDto);
    }

    async deleteUserCredentials(id: string): Promise<void> {
        await this.model.deleteOne({ id: id });
    }

    async validateUserCredentials(email: string, password: string): Promise<boolean> {
        const userCredentialsDto = await this.model.findOne({ email: email });
        if (!userCredentialsDto || !userCredentialsDto.password) return false;
        console.log("The password in usercredentials is: ", userCredentialsDto.password.encryptedValue);
        console.log("The current password is: ", password);
        return await compare(password, String(userCredentialsDto.password.encryptedValue));
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["UserCredentials"] ?? connection.model("UserCredentials", UserCredentialsSchema, "user_credentials");
    }
}

let userCredentialsRepository: UserCredentialsRepository | null = null;

export function getUserCredentialRepository(): UserCredentialsRepository {
    if (userCredentialsRepository !== null) {
        return userCredentialsRepository;
    }

    const connection: Connection = connectDB();
    userCredentialsRepository = new MongoDbUserCredentialsRepository(connection);
    return userCredentialsRepository;
}
