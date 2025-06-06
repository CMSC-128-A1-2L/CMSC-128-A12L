import { Schema } from "mongoose";

export interface UserPasswordCredentialsDto {
    id: string;
    encryptedValue: string;
    sessionExpiry: Date;
}

export interface UserGoogleCredentialsDto {
    id: string;
    refreshToken: string;
}

export interface UserCredentialsDto {
    id: string;
    email: string;
    password?: UserPasswordCredentialsDto;
    google?: UserGoogleCredentialsDto;
}

export const UserPasswordCredentialsSchema = new Schema<UserPasswordCredentialsDto>(
    {
        id: { type: String, required: true },
        encryptedValue: { type: String, required: true },
        sessionExpiry: { type: Date, required: true },
    }
)

export const UserGoogleCredentialsSchema = new Schema<UserGoogleCredentialsDto>(
    {
        id: { type: String, required: true },
        refreshToken: { type: String, required: true }
    }
)

export const UserCredentialsSchema = new Schema<UserCredentialsDto>(
    {
        id: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: UserPasswordCredentialsSchema },
        google: { type: UserGoogleCredentialsSchema }
    }
)
