import { NextRequest, NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { User } from "@/entities/user";
import { getUserIdProvider } from "@/providers/user_id";

// Create user endpoint
export async function POST(req: NextRequest) {
  console.log("Create user endpoint has been triggered.");

  const body = await req.json();

  const userIdProvider = getUserIdProvider();
  const user: User = {
    role: body.role,
    id: userIdProvider.generate(),
    email: body.email,
    emailVerified: null,
    name: body.name
  };

  const userRepository = getUserRepository();
  return await userRepository.createUser(user)
    .then(() => new NextResponse(JSON.stringify(user), { status: 200 }))
    .catch((err) => new NextResponse(JSON.stringify(err), { status: 500 }));
}

// Get all users endpoint
export async function GET(req: NextRequest) {
  console.log("Get all users endpoint has been triggered.");

  const userRepository = getUserRepository();
  const users = await userRepository.getAllUsers();
  return NextResponse.json(users);
}
