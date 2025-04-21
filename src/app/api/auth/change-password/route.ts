import { ChangePasswordService, IChangePasswordService } from "@/providers/change_password";
import { getPasswordEncryptionProvider, PasswordEncryptionProvider } from "@/providers/password_encryption";
import { ChangePasswordVerifierRepository, getChangePasswordVerifierRepository } from "@/repositories/change_password_verifier_repository";
import { getUserCredentialRepository, UserCredentialsRepository } from "@/repositories/user_credentials_repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const userCredentialsRepository: UserCredentialsRepository = getUserCredentialRepository();
    const passwordEncryptionProvider: PasswordEncryptionProvider = getPasswordEncryptionProvider();
    const changePasswordVerifierRepository: ChangePasswordVerifierRepository = getChangePasswordVerifierRepository();

    const changePasswordService: IChangePasswordService = new ChangePasswordService(
        passwordEncryptionProvider,
        changePasswordVerifierRepository,
        userCredentialsRepository
    );

    const body = await req.json();
    if (!body.userId) {
        return NextResponse.json({ error: "Missing required property in body." }, { status: 400 });
    }
    if (typeof (body.userId) !== 'string') {
        return NextResponse.json({ error: "Incorrect type of userId." }, { status: 400 });
    }
    if (!body.newPassword) {
        return NextResponse.json({ error: "Missing required property in body." }, { status: 400 });
    }
    if (typeof (body.newPassword) !== 'string') {
        return NextResponse.json({ error: "Incorrect type of newPassword." }, { status: 400 });
    }

    const userId: string = body.userId;
    const newPassword: string = body.newPassword;

    await changePasswordService.finalizePasswordChange(userId, newPassword);
    return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
}
