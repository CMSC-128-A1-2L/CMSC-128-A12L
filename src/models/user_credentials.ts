import { Schema, Types } from "mongoose";

export interface UserPasswordCredentialsDto {
    _id: Types.ObjectId;
    encryptedValue: string;
    refreshToken?: string;
}

export interface UserGoogleCredentialsDto {
    _id: Types.ObjectId;
    refreshToken: string;
}

export interface UserCredentialsDto {
    _id: Types.ObjectId;
    email: string;
    password?: UserPasswordCredentialsDto;
    google?: UserGoogleCredentialsDto;
}

export const UserPasswordCredentialsSchema = new Schema<UserPasswordCredentialsDto>(
    {
        encryptedValue: { type: String, required: true },
        refreshToken: { type: String },
    }
)

export const UserGoogleCredentialsSchema = new Schema<UserGoogleCredentialsDto>(
    {
        refreshToken: { type: String, required: true }
    }
)

export const UserCredentialsSchema = new Schema<UserCredentialsDto>(
    {
        email: { type: String, required: true },
        password: { type: UserPasswordCredentialsSchema },
        google: { type: UserGoogleCredentialsSchema }
    }
)
