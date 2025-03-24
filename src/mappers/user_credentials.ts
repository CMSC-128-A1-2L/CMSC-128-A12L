import { UserCredentials } from "@/entities/user_credentials"
import { UserCredentialsDto } from "@/models/user_credentials"
import { Types } from "mongoose"

export function mapUserCredentialsDtoToUserCredentials(userCredentialsDto: UserCredentialsDto): UserCredentials {
    return {
        id: userCredentialsDto._id.toString(),
        email: userCredentialsDto.email,
        password: userCredentialsDto.password !== undefined ? {
            id: userCredentialsDto.password._id.toString(),
            encryptedValue: userCredentialsDto.password.encryptedValue,
            refreshToken: userCredentialsDto.password.refreshToken
        } : undefined,
        google: userCredentialsDto.google !== undefined ? {
            id: userCredentialsDto.google._id.toString(),
            refreshToken: userCredentialsDto.google.refreshToken
        } : undefined
    }
}

export function mapUserCredentialsToUserCredentialsDto(userCredentials: UserCredentials): UserCredentialsDto {
    return {
        _id: new Types.ObjectId(userCredentials.id),
        email: userCredentials.email,
        password: userCredentials.password !== undefined ? {
            _id: new Types.ObjectId(userCredentials.password.id),
            encryptedValue: userCredentials.password.encryptedValue,
            refreshToken: userCredentials.password.refreshToken
        } : undefined,
        google: userCredentials.google !== undefined ? {
            _id: new Types.ObjectId(userCredentials.google.id),
            refreshToken: userCredentials.google.refreshToken
        } : undefined
    }
}

