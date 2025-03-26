import { NextRequest, NextResponse } from "next/server";
import { createAddressWithAdminId, deleteAddressesByForeignId, updateAddress, getAddressesByForeignId} from "@/app/services/address/addressService";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Create address with adminId endpoint triggered.");
    
    let adminId = params.id;
    let requestBody = await req.json();
    
    let result = await createAddressWithAdminId(adminId, requestBody);
    return NextResponse.json(result);
  }
  
  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Update address endpoint triggered.");
    
    let addressId = params.id;
    let requestBody = await req.json();
    
    let resuelt = await updateAddress(addressId, requestBody);
    return NextResponse.json(resuelt);
  }

  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Delete addresses by foreignId endpoint triggered.");
    
    let foreignId = params.id;
    
    let result = await deleteAddressesByForeignId(foreignId);
    return NextResponse.json(result);
  }

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Get addresses by foreignId endpoint triggered.");
    
    let foreignId = params.id;
    
    let result = await getAddressesByForeignId(foreignId);
    return NextResponse.json(result);
  }