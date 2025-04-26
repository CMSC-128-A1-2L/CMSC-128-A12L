import { NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";

export async function GET() {
  try {
    const userRepo = getUserRepository();
    const alumni = await userRepo.getAllAlumni();
    return NextResponse.json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}
