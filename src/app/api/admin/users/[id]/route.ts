import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser, editUser } from "@/app/services/user/userService";
import { IUser } from "@/models/user_model";

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