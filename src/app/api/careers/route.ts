import { NextRequest, NextResponse } from "next/server";
import { getCareerRepository } from "@/repositories/careers_repository";
import { getAddressRepository } from "@/repositories/address_repository";
import { Careers } from "@/entities/careers";
import { Address } from "@/entities/address";

export async function GET() {
  const repo = getCareerRepository();
  const allCareers = await repo.getAllCareers();
  return NextResponse.json(allCareers, { status: 200 });
}
export async function POST(req: NextRequest) {
    console.log("POST /api/careers triggered.");
  
    const body = await req.json();
    const careerRepo = getCareerRepository();
    const addressRepo = getAddressRepository();
  
    try {
      // destructure address
      const { address, ...careerData } = body;
  
      // create career
      const newCareerId = await careerRepo.createCareer(careerData as Careers);
      console.log("✅Created Career ID:", newCareerId);
  
      //  if address exists, create address using that career's _id
      if (address) {
        const addressWithCareerID: Address = {
          ...address,
          alumniID: newCareerId
        };
  
        const newAddressId = await addressRepo.createAddress(addressWithCareerID);
        console.log("✅ Created Address ID:", newAddressId, "linked to:", newCareerId);
      }
  
      return NextResponse.json({ id: newCareerId }, { status: 201 });
  
    } catch (err) {
      console.error("❌ Failed to create career and/or address:", err);
      return new NextResponse("Failed to create career", { status: 500 });
    }
  }
  