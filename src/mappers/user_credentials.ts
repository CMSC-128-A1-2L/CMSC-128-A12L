import { UserCredentials } from "@/entities/user_credentials"
import { UserCredentialsDto } from "@/models/user_credentials"
import { Types } from "mongoose"

export function mapUserCredentialsDtoToUserCredentials(userCredentialsDto: UserCredentialsDto): UserCredentials {
    return {
        id: userCredentialsDto.id,
        email: userCredentialsDto.email,
        password: userCredentialsDto.password !== undefined ? {
            id: userCredentialsDto.password.id,
            encryptedValue: userCredentialsDto.password.encryptedValue,
            refreshToken: userCredentialsDto.password.refreshToken
        } : undefined,
        google: userCredentialsDto.google !== undefined ? {
            id: userCredentialsDto.google.id,
            refreshToken: userCredentialsDto.google.refreshToken
        } : undefined
    }
}

export function mapUserCredentialsToUserCredentialsDto(userCredentials: UserCredentials): UserCredentialsDto {
    return {
        id: userCredentials.id,
        email: userCredentials.email,
        password: userCredentials.password !== undefined ? {
            id: userCredentials.password.id,
            encryptedValue: userCredentials.password.encryptedValue,
            refreshToken: userCredentials.password.refreshToken
        } : undefined,
        google: userCredentials.google !== undefined ? {
            id: userCredentials.google.id,
            refreshToken: userCredentials.google.refreshToken
        } : undefined
    }
}

