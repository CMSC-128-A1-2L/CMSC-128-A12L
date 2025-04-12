import { NextRequest, NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";

// Get all users endpoint
export async function GET(req: NextRequest) {
  console.log("Get all users endpoint has been triggered.");

  const userRepository = getUserRepository();
  const users = await userRepository.getUsersByPendingVerification();
  return NextResponse.json(users);
}
