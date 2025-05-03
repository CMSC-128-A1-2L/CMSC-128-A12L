import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserRepository } from "@/repositories/user_repository";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRepository = getUserRepository();
        const user = await userRepository.getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            graduationYear: user.graduationYear,
            department: user.department,
            bio: user.bio,
            currentPosition: user.currentPosition,
            currentCompany: user.currentCompany,
            currentLocation: user.currentLocation,
            phoneNumber: user.phoneNumber,
            linkedIn: user.linkedIn,
            website: user.website
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            graduationYear,
            department,
            bio,
            currentPosition,
            currentCompany,
            currentLocation,
            phoneNumber,
            linkedIn,
            website
        } = body;

        const userRepository = getUserRepository();
        const user = await userRepository.getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update user profile
        user.graduationYear = graduationYear;
        user.department = department;
        user.bio = bio;
        user.currentPosition = currentPosition;
        user.currentCompany = currentCompany;
        user.currentLocation = currentLocation;
        user.phoneNumber = phoneNumber;
        user.linkedIn = linkedIn;
        user.website = website;

        await userRepository.updateUser(user);

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 