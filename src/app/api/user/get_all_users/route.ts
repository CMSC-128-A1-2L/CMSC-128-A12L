
import { getAllUsers } from "@/app/services/user/userService";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  console.log("Get all users endpoint has been triggered.");
  
  console.log(req.body);

  let result = await getAllUsers();
  return NextResponse.json(result);
}
