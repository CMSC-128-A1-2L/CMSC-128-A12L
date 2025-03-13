import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/app/services/user/userService";
import { IUser } from "@/models/user_model";

export async function POST(req: Request) {
  console.log("Create user endpoint has been triggered.");

  let request = await req.json();
  // console.log(request);

  let created_user = await createUser(request as unknown as IUser);
  return NextResponse.json(created_user);
}

