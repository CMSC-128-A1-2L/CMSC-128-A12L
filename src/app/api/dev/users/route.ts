import { NextRequest, NextResponse } from "next/server";
import data from "@/dummy_data/user.json"

// Populate database endpoint
export async function POST(req: NextRequest) {
  console.log("[DEV] Triggered populate user collection endpoint.");
  // Currently left unimplemented. Dummy data needs implementing.
}

export async function DELETE(req: NextRequest) {
  console.log("[DEV] Triggered clear user collection endpoint.");
  // Currently left unimplemented. Dummy data needs implementing.
}
