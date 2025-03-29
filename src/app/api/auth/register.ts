import { User } from "@/entities/user";
import { UserCredentials } from "@/entities/user_credentials";
import { getPasswordEncryptionProvider } from "@/providers/password_encryption";
import { getUserIdProvider } from "@/providers/user_id";
import { getUserCredentialRepository } from "@/repositories/user_credentials_repository";
import { getUserRepository } from "@/repositories/user_repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();

    const name: string = `${body.firstname} ${body.lastname}`;
    const email: string = body.email;
    const password: string = body.password;

    const userIdProvider = getUserIdProvider();
    const passwordEncryptionProvider = getPasswordEncryptionProvider();

    const id: string = userIdProvider.generate();
    const encryptedPassword: string = passwordEncryptionProvider.encrypt(password);

    const userRepository = getUserRepository();
    const userCredentialsRepository = getUserCredentialRepository();

    const user: User = {
        id,
        name,
        email,
        emailVerified: null,
        role: []
    };

    const userCredentials: UserCredentials = {
        id,
        email,
        password: {
            id: userIdProvider.generate(),
            encryptedValue: encryptedPassword,
            sessionExpiry: new Date()
        }
    };

    return await Promise.all([
        userRepository.createUser(user),
        userCredentialsRepository.createUserCredentials(userCredentials)
    ]).then(() => new NextResponse(JSON.stringify(user), { status: 200 }));
}
