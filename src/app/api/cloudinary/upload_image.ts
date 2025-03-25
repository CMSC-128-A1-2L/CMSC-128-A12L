
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploader = cloudinary.uploader;

// async function uploadImageEndpoint(req: NextApiRequest, res: NextApiResponse) {
//     console.log("Endpoint for image upload has been triggered.");
//     try {
//         const pictureFile = req.file;

//         if (!pictureFile) {
//             return res.status(400).json({
//                 error: "No file uploaded."
//             })
//         };

//         const imageString = pictureFile.buffer.toString('base64');

//         let uploadImage_result = await uploadImage(imageString);

//         console.log("Successfully uploaded image to cloudinary.");

//         res.status(201).json({
//             success: true,
//             imageAddress: uploadImage_result.secure_url,
//             message: "Successfully uploaded image to Cloudinary."
//         });

//     } catch (err) {

//         console.log("There was an error uploading the image:", err);
//         return res.status(400).json({
//             success: false,
//             data: err,
//             message: "There was an error uploading an image to cloudinary."
//         })

//     }
// }

async function uploadImage(fileBuffer: Buffer) {
    console.log("Uploading image to cloudinary.");


    let tags = {
        "tags": ["ARTMS"]
    };

    try {
      
    
    } catch (err) {
        console.log("There was an error uploading the image:", err);
        return(err);
    }
}

export {
  uploadImage
}