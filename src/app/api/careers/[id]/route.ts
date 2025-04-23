import { NextRequest, NextResponse } from "next/server";
import { getCareerRepository } from "@/repositories/careers_repository";
import { getAddressRepository } from "@/repositories/address_repository";
import { Careers } from "@/entities/careers";
import { Address } from "@/entities/address";

// GET /api/careers/[id] — Get careers by alumniID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const alumniID = params.id;
  console.log("GET /api/careers/[id] triggered for alumniID:", alumniID);

  const repo = getCareerRepository();

  try {
    const careers = await repo.getCareersByAlumniId(alumniID);
    return NextResponse.json(careers, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to get careers for alumniID:", alumniID, err);
    return new NextResponse("Failed to fetch careers", { status: 500 });
  }
}
// PUT /api/careers/[id] — Update career and address by alumniID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const alumniID = params.id;
    console.log("PUT /api/careers/[id] triggered for alumniID:", alumniID);
  
    const body = await req.json();
    const { address, ...careerData } = body;
  
    const careerRepo = getCareerRepository();
    const addressRepo = getAddressRepository();
  
    try {
      // Step 1: Find the career first, to get its _id
      const careers = await careerRepo.getCareersByAlumniId(alumniID);
      const careerToUpdate = careers?.[0];
  
      if (!careerToUpdate || !careerToUpdate._id) {
        return new NextResponse("Career not found for alumniID", { status: 404 });
      }
  
      const careerID = careerToUpdate._id;
      console.log("Found careerID for alumniID:", careerID);
  
      // Step 2: Update the address if present
      if (address) {
        const addressToUpdate: Address = {
          ...address,
          alumniID: careerID // This is the correct binding
        };
  
        await addressRepo.updateAddressByAlumniId(addressToUpdate);
        console.log("✅ Updated address for careerID:", careerID);
      }
  
      // Step 3: Update the career itself
      await careerRepo.updateCareerByAlumniId({ ...careerData, alumniID } as Careers);
      console.log("✅ Updated career for alumniID:", alumniID);
  
      return new NextResponse("Career and address updated", { status: 200 });
    } catch (err) {
      console.error("❌ Failed to update career and/or address for alumniID:", alumniID, err);
      return new NextResponse("Failed to update career and/or address", { status: 500 });
    }
  }
  

// DELETE /api/careers/[id] — Delete career and address by alumniID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const alumniID = params.id;
    console.log("DELETE /api/careers/[id] triggered for alumniID:", alumniID);
  
    const careerRepo = getCareerRepository();
    const addressRepo = getAddressRepository();
  
    try {
      // Step 1: Get career to extract the actual career ID (_id)
      const careers = await careerRepo.getCareersByAlumniId(alumniID);
      const careerToDelete = careers?.[0];
  
      if (!careerToDelete || !careerToDelete._id) {
        return new NextResponse("Career not found for alumniID", { status: 404 });
      }
  
      const careerID = careerToDelete._id;
      console.log("Found careerID for alumniID:", careerID);
  
      // Step 2: Delete career
      await careerRepo.deleteCareerByAlumniId(alumniID);
      console.log("✅ Deleted career for alumniID:", alumniID);
  
      // Step 3: Delete associated address using careerID
      await addressRepo.deleteAddressByAlumniId(careerID);
      console.log("✅ Deleted address for careerID:", careerID);
  
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      console.error("❌ Failed to delete career and/or address:", err);
      return new NextResponse("Failed to delete career and/or address", { status: 500 });
    }
  }
  
