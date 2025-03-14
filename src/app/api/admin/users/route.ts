import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers, editUser} from "@/app/services/user/userService";
import { IUser } from "@/models/user_model";

// Create user endpoint
export async function POST(req: Request) {
  console.log("Create user endpoint has been triggered.");

  let request = await req.json();
  // console.log(request);

  let created_user = await createUser(request as unknown as IUser);
  return NextResponse.json(created_user);
}

// Get all users endpoint
export async function GET(req: Request) {
  console.log("Get all users endpoint has been triggered.");
  
  console.log(req.body);

  let result = await getAllUsers();
  return NextResponse.json(result);
}