import { uploadImage } from "./upload_image";
import { NextResponse } from "next/server";


export default async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("file") as File | null;

    if (!image) {
        return NextResponse.json({
                "success": false,
                "error": "No image uploaded."
            }, {"status": 400}
        )
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
  } catch {

  }
}

// export {
//     uploadImageEndpoint
// }