import { User } from "@/models/user";
import { injectable } from "tsyringe";

export interface UserRepository {
    createUser(user: User): Promise<void>;

    getUserById(id: string): Promise<User>;

    updateUser(user: User): Promise<void>;

    deleteUser(id: string): Promise<void>;
}

@injectable()
export class InMemoryUserRepository implements UserRepository {
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
