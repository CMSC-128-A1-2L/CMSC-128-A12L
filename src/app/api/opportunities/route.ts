import { NextRequest, NextResponse } from "next/server";
import { getAllOpportunities } from "../../services-opportunities/opportunities-CRUD";


export async function GET(req: NextRequest) {
  console.log("Get all addresses.");
  
  let result = await getAllOpportunities();
  return NextResponse.json(result);
}
