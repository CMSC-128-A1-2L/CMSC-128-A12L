
import { NextRequest, NextResponse } from "next/server";
import { getAllAddresses } from "@/app/services/address/addressService";


export async function GET(req: NextRequest) {
  console.log("Get all addresses endpoint triggered.");
  
  let result = await getAllAddresses();
  return NextResponse.json(result);
}
