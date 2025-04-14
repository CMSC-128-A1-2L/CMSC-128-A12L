import { NextRequest, NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { User } from "@/entities/user";
import { uploadPdf } from "@/app/api/cloudinary/upload_pdf";
// Edit user endpoint
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Edit user endpoint has been triggered.");

  const {id} = await params;
  const formData = await req.formData();
  const pdfFile = formData.get("pdfFile") as File | null;
  const userRepository = getUserRepository();
  const user = await userRepository.getUserById(id);
  console.log("m n;sj;aiokdvbkujalshvduklyasvdukhgsvad: ", user)
  if (user === null) {
    const response = new NextResponse("User not found", { status: 404 });
    return response;
  }

  if (!pdfFile) {
    return NextResponse.json(
        { error: "PDF document is required for registration" },
        { status: 400 }
    );
}
  // Convert PDF file to buffer for Cloudinary upload
  const arrayBuffer = await pdfFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Upload PDF to Cloudinary
  const uploadResult = await uploadPdf(buffer, pdfFile.name);
  if (!uploadResult.success) {
    return NextResponse.json(
        { error: "Failed to upload PDF document" },
        { status: 500 }
    );
}
  const updatedUser: User = {
    ...user,
    documentUrl: uploadResult.url
  }

  console.log("Updated user: ", updatedUser)

  return await userRepository.updateUser(updatedUser)
    .then(() => new NextResponse(JSON.stringify(updatedUser), { status: 200 }))
    .catch(() => new NextResponse("Failed to update user", { status: 500 }));
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params;
  const userRepository = getUserRepository();
  const user = await userRepository.getUserById(id);
  return NextResponse.json(user);
}
