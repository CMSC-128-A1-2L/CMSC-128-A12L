import { User, UserRole } from "@/entities/user";
import { UserCredentials } from "@/entities/user_credentials";
import { getPasswordEncryptionProvider } from "@/providers/password_encryption";
import { getUserIdProvider } from "@/providers/user_id";
import { getUserCredentialRepository } from "@/repositories/user_credentials_repository";
import { getUserRepository } from "@/repositories/user_repository";
import { NextRequest, NextResponse } from "next/server";
import { uploadPdf } from "../../cloudinary/upload_pdf";
import { AlumniStatus } from "@/models/user";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();
        console.log("Register form data received");
        
        const firstname = formData.get("firstname") as string;
        const lastname = formData.get("lastname") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const pdfFile = formData.get("pdfFile") as File | null;

        if (!pdfFile) {
            return NextResponse.json(
                { error: "PDF document is required for registration" },
                { status: 400 }
            );
        }

        // Convert PDF file to buffer for Cloudinary upload
        const arrayBuffer = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Upload PDF to Cloudinary
        const uploadResult = await uploadPdf(buffer, pdfFile.name);
        
        if (!uploadResult.success) {
            return NextResponse.json(
                { error: "Failed to upload PDF document" },
                { status: 500 }
            );
        }

        // Continue with user registration
        const name: string = `${firstname} ${lastname}`;
        
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
            role: [],
            alumniStatus: AlumniStatus.PENDING,
            documentUrl: uploadResult.url
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

        await Promise.all([
            userRepository.createUser(user),
            userCredentialsRepository.createUserCredentials(userCredentials)
        ]);

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                documentUrl: uploadResult.url
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Registration failed", details: error },
            { status: 500 }
        );
    }
}
