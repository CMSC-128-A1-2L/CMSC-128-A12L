import { NextRequest, NextResponse } from "next/server";
import { getAddressRepository } from "@/repositories/address_repository";
import { Address } from "@/entities/address";

// object ID NEEDS to also be in the request body
// GET address by alumniID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const alumniID = params.id;
  console.log("GET address for:", alumniID);

  const repo = getAddressRepository();
  const address = await repo.getAddressByAlumniId(alumniID);

  if (!address) {
    return new NextResponse("Address not found", { status: 404 });
  }

  return NextResponse.json(address, { status: 200 });
}

// POST (create) address with alumniID from request body
export async function POST(req: NextRequest) {
  console.log("POST address triggered.");

  const body = await req.json();
  const repo = getAddressRepository();

  if (!body.alumniID) {
    return new NextResponse("Missing alumniID in body", { status: 400 });
  }

  try {
    const newId = await repo.createAddress(body as Address);
    return new NextResponse(JSON.stringify({ id: newId }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to create address", { status: 500 });
  }
}

// PUT (update) address by alumniID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const alumniID = params.id;
  console.log("PUT address for:", alumniID);

  const body = await req.json();
  const repo = getAddressRepository();

  const addressToUpdate: Address = {
    ...body,
    alumniID // enforce path param for consistency
  };

  try {
    await repo.updateAddressByAlumniId(addressToUpdate);
    return new NextResponse("Address updated successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to update address", { status: 500 });
  }
}

// DELETE address by alumniID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const alumniID = params.id;
  console.log("DELETE address for:", alumniID);

  const repo = getAddressRepository();

  try {
    await repo.deleteAddressByAlumniId(alumniID);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to delete address", { status: 500 });
  }
}
