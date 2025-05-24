import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }    // Check file type with more specific validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be a PDF or Word document (doc/docx)' },
        { status: 400 }
      );
    }

    try {
      // Convert file to buffer then base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64String}`;

      // Upload to Cloudinary with better error handling
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'raw',
        folder: 'job_applications/resumes',
        allowed_formats: ['pdf', 'doc', 'docx'],
        format: file.type.includes('pdf') ? 'pdf' : 'doc',
        use_filename: true,
        unique_filename: true,
        tags: ['job_application', 'resume']
      });

      if (!result || !result.secure_url) {
        throw new Error('Failed to get upload URL from Cloudinary');
      }

      return NextResponse.json({
        url: result.secure_url,
        public_id: result.public_id
      });    } catch (error: any) {
      console.error('Error uploading resume to Cloudinary:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to upload resume to Cloudinary' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing resume upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process resume upload. Please try again.' },
      { status: 500 }
    );
  }
}