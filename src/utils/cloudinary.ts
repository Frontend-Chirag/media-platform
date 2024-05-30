import { ImageType } from '@/components/ModelProvider';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure cloudinary
cloudinary.config({
    cloud_name: 'di7sjizcl',
    api_key: '577853343312115',
    api_secret: 'sQ13wVGSpHatZhhM4TCYZF7hDQc'
});

// Upload file to cloudinary
export const uploadOnCloudinary = async (LocalFilePath: string) => {
    try {
        if (!LocalFilePath) return null;
       console.log('file path',LocalFilePath)
        // Upload file to cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: 'auto'
        });
        // file has been uploaded successfully
        fs.unlinkSync(LocalFilePath); // remove the locally saved temporary file after upload
        return response.url
    } catch (error) {
        fs.unlinkSync(LocalFilePath); // remove the locally saved temporary file as the
        // upload operation got failed
        console.log(error)
        return null
    }
}

// upload multiple file on cloudiary 
