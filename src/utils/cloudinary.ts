import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to cloudinary
export const uploadOnCloudinary = async (LocalFilePath: string) => {
    try {
        if (!LocalFilePath) return null;

        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: 'auto'
        });
        // file has been uploaded successfully
        console.log('File uploaded successfully', response.url);
        fs.unlinkSync(LocalFilePath); // remove the locally saved temporary file after upload
        return response.url
    } catch (error) {
        fs.unlinkSync(LocalFilePath); // remove the locally saved temporary file as the
        // upload operation got failed
        console.log(error)
        return null
    }
}