import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser, deleteUser, editUser } from "@/app/services/user/userService";
import { IUser } from "@/models/user";

// Edit user endpoint
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Edit user endpoint has been triggered.");

  let {id} = await params;
  console.log(id);
  let user = await req.json();
  console.log(user);

  let edited_user = await editUser(id, user);
  return NextResponse.json(edited_user);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Delete user endpoint has been triggered.");

  let {id} = await params;
  console.log(id);

  let deleted_user = await deleteUser(id);
  return NextResponse.json(deleted_user);
}
