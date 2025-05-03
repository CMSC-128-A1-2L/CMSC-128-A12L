import { NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { UserRole } from "@/entities/user";

export async function GET() {
  try {
    const userRepository = getUserRepository();
    const alumni = await userRepository.getAllAlumni();
    return NextResponse.json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}
