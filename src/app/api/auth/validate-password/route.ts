import { NextRequest, NextResponse } from "next/server";
import { getUserCredentialRepository } from "@/repositories/user_credentials_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword } = await request.json();
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    const userCredentialsRepo = getUserCredentialRepository();
    const userCredentials = await userCredentialsRepo.getUserCredentialsById(session.user.id);

    if (!userCredentials) {
      return NextResponse.json(
        { error: "User credentials not found" },
        { status: 404 }
      );
    }

    const isValid = await userCredentialsRepo.validateUserCredentials(
      userCredentials.email,
      currentPassword
    );

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error validating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 