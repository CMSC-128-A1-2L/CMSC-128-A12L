import { NextRequest, NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { User } from "@/entities/user";

// Get user with specified id
export async function GET(req: NextRequest,  { params }: { params: { id: string } }) {
  console.log("Get user endpoint has been triggered.");

  const {id} = await params;

  const userRepository = getUserRepository();
  const user = await userRepository.getUserById(id);

  if (user === null) {
    const response = new NextResponse("User not found", { status: 404 });
    return response;
  }

  return new NextResponse(JSON.stringify(user), { status: 200 });
}

// Edit user endpoint
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Edit user endpoint has been triggered.");

  const {id} = await params;

  const userRepository = getUserRepository();
  const user = await userRepository.getUserById(id);
  console.log("Found user: ", user)
  if (user === null) {
    const response = new NextResponse("User not found", { status: 404 });
    return response;
  }

  const body = await req.json();
  const updatedUser: User = {
    ...user,
    ...body
  }

  console.log("Updated user: ", updatedUser)

  return await userRepository.updateUser(updatedUser)
    .then(() => new NextResponse(JSON.stringify(updatedUser), { status: 200 }))
    .catch(() => new NextResponse("Failed to update user", { status: 500 }));
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Delete user endpoint has been triggered.");

  let {id} = await params;
  console.log(id);

  const userRepository = getUserRepository();

  return await userRepository.deleteUser(id)
    .then(() => new NextResponse(null, { status: 204 }))
    .catch(() => new NextResponse("Failed to delete user", { status: 500 }));
}
