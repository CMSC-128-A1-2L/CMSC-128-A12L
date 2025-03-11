import { connectDB } from "@/app/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return NextResponse.json({ message: "This is the change that has been made" });
}


