import { connectDB } from "@/databases/mongodb";
import { User, UserRole } from "@/entities/user";
import { mapUserDtoToUser, mapUserToUserDto } from "@/mappers/user";
import { UserDto, UserRoleDto, UserSchema } from "@/models/user";
import { Connection, Model } from "mongoose";
import { getUserCredentialRepository } from "./user_credentials_repository";
import { ObjectId } from "mongodb";

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
     * Gets all users from the repository.
     * 
     * @returns A promise that resolves to an array of users.
     */

    getUsersByPendingVerification(): Promise<User[]>;

    getAllUsers(): Promise<User[]>;

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

    /**
     * Gets all alumni users from the repository.
     * 
     * @returns A promise that resolves to an array of alumni users.
     */
    getAllAlumni(): Promise<User[]>;

    /**
     * Gets a user by job ID from the repository.
     * 
     * @param jobId The job ID associated with the user.
     * @returns A promise that resolves to either the fetched user or `null` if the user does not exist.
     */
    getUserByJobId(jobId: string): Promise<User | null>;
}

class MongoDBUserRepository implements UserRepository {
    private connection: Connection;
    private model: Model<UserDto>;

    async createUser(user: User): Promise<void> {
        const userDto = mapUserToUserDto(user);
        
        await this.model.create(userDto);
    }

    async getUserById(id: string): Promise<User | null> {
        const userDto = await this.model.findOne({ id: id });
        
        if (userDto === null) {
            return null;
        }
        
        return mapUserDtoToUser(userDto);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const userDto = await this.model.findOne({
            email: email
        });
        
        if (userDto === null) {
            return null;
        }
        
        return mapUserDtoToUser(userDto);
    }

    async getAllUsers(): Promise<User[]> {
        const userDtos = await this.model.find();
        return userDtos.map(mapUserDtoToUser);
    }

    async getUsersByPendingVerification(): Promise<User[]> {
        const userDtos = await this.model.find({ alumniStatus: "pending" });
        return userDtos.map(mapUserDtoToUser);
    }

    async updateUser(user: User): Promise<void> {
        const userDto = mapUserToUserDto(user);
        
        await this.model.findOneAndUpdate({ id: user.id }, userDto);
    }

    async deleteUser(id: string): Promise<void> {

        try{
            await this.model.findOneAndDelete({ id: id });

            // we need to cascade delete the user (based on other collections of the database)
            // TODO: as other models come together, please add the cascade delete here
            const userCredentialsRepository = getUserCredentialRepository();
            await userCredentialsRepository.deleteUserCredentials(id);
        } catch (error) {
            console.error(error);
        }
    }

    async getAllAlumni(): Promise<User[]> {
        const userDtos = await this.model.find({
            role: { $bitsAllSet: UserRoleDto.ALUMNI }
        });
        return userDtos.map(mapUserDtoToUser);
    }

    async getUserByJobId(jobId: string): Promise<User | null> {
        const result = await this.connection.collection("opportunities").findOne(
            { _id: new ObjectId(jobId) },
            { projection: { userId: 1 } }
        );

        if (!result) return null;

        return this.getUserById(result.userId);
    }

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["User"] ?? connection.model("User", UserSchema, "users");
    }
}

let userRepository: UserRepository | null = null;

export function getUserRepository(): UserRepository {
    if (userRepository !== null) {
        return userRepository;
    }

    const connection = connectDB();
    userRepository = new MongoDBUserRepository(connection);
    return userRepository;
}

