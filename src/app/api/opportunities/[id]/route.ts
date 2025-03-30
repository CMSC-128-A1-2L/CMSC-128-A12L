import { NextRequest, NextResponse } from "next/server";
import { createOpportunity, updateOpportunity , deleteOpportunity, getSpecificOpportunity} from "../../../../app/services-opportunities/opportunities-CRUD";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Create opportunity.");
    
    let adminId = params.id;
    let requestBody = await req.json();
    
    let result = await createOpportunity(adminId, requestBody);
    return NextResponse.json(result);
  }
  
  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Update opportunity.");
    
    let addressId = params.id;
    let requestBody = await req.json();
    
    let result = await updateOpportunity(addressId, requestBody);
    return NextResponse.json(result);
  }

  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Delete opportunity.");
    
    let foreignId = params.id;
    
    let result = await deleteOpportunity(foreignId);
    return NextResponse.json(result);
  }

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Get opportunity by opportunityID.");
    
    let foreignId = params.id;
    
    let result = await getSpecificOpportunity(foreignId);
    return NextResponse.json(result);
  }