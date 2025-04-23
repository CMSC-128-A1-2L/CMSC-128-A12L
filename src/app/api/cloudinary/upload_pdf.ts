import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploader = cloudinary.uploader;

export async function uploadPdf(fileBuffer: Buffer, fileName: string) {
    console.log("Uploading PDF to Cloudinary.");

    try {
        // Convert buffer to base64
        const base64File = fileBuffer.toString('base64');
        const dataURI = `data:application/pdf;base64,${base64File}`;

        // Upload to Cloudinary with raw resource type for PDFs
        const result = await uploader.upload(dataURI, {
            resource_type: 'raw', // Important for PDF files
            folder: 'alumni_documents',
            public_id: fileName.replace('.pdf', ''), // Remove extension for public_id
            tags: ["ALUMNI_DOCUMENTS"]
        });

        console.log("Successfully uploaded PDF to Cloudinary.");
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (err) {
        console.log("There was an error uploading the PDF:", err);
        return {
            success: false,
            error: err
        };
    }
} 