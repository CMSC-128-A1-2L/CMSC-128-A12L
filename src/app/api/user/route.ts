
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({ message: "This is the change that has been made" });
}
