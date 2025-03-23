import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers, editUser} from "@/app/services/user/userService";
import { IUser, IUserRequest } from "@/models/user";

// Create user endpoint
export async function POST(req: NextRequest) {
  console.log("Create user endpoint has been triggered.");

  let request = await req.json();
  // console.log(request);

  let created_user = await createUser(request as unknown as IUser);
  return NextResponse.json(created_user);
}

// Get all users endpoint
export async function GET(req: NextRequest,  { params }: { params: { id: string } }) {
  console.log("Get all users endpoint has been triggered.");
  
  let searchParams = convertUserRequestToJSON(req.nextUrl.searchParams);
  console.log(searchParams);

  // let body = await req.json();

  // let {filters} = body;

  let result = await getAllUsers(searchParams);
  return NextResponse.json(result);
}

function convertUserRequestToJSON(params: URLSearchParams): IUserRequest {
  let parameters = Object.fromEntries(params.entries()) as unknown as IUserRequest;
  return parameters;
}
