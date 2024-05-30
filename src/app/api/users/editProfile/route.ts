import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import { uploadOnCloudinary } from '@/utils/cloudinary';
import { writeFile } from "fs/promises";
import axios from 'axios';


export async function PATCH(req: NextRequest) {
    try {
        await ConnectedToDatabase();

        const reqbody = await req.json();
        const { updatedProfileData, userId } = reqbody;

        let profilePictureUrl = updatedProfileData.profilePicture.url;
        let backgroundImageUrl = updatedProfileData.backgroundImage.url;

        // Check if profile picture is not empty and not already uploaded
        if ((profilePictureUrl !== '') && (!updatedProfileData.profilePicture.isUploaded)) {
            console.log('working')
            const imageData = await downloadMedia(profilePictureUrl);
            const fileName = `profile_image`;
            const localPath = join('./public/temp', fileName);
            await writeFile(localPath, imageData);
            profilePictureUrl = await uploadOnCloudinary(localPath);
        }

        // Check if background image is not empty and not already uploaded
        if ((backgroundImageUrl !== '') && (!updatedProfileData.backgroundImage.isUploaded)) {
            const backgroundImageData = await downloadMedia(backgroundImageUrl);
            const backgroundImageFileName = `background_image`;
            const backgroundImageLocalPath = join('./public/temp', backgroundImageFileName);
            await writeFile(backgroundImageLocalPath, backgroundImageData);
            backgroundImageUrl = await uploadOnCloudinary(backgroundImageLocalPath);
        }

        const user = await User.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                name: updatedProfileData.name,
                bio: updatedProfileData.bio,
                profilePicture: profilePictureUrl && profilePictureUrl,
                backgroundImage: backgroundImageUrl,
                profession: updatedProfileData.profession,
                location: updatedProfileData.location,
                link: updatedProfileData.link,
                dob: updatedProfileData.dob
            },
            {
                new: true
            }
        );


        return NextResponse.json({ id: user._id, message: 'Profile get updated successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to update Profile' }, { status: 404 })
    }
}

async function downloadMedia(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    return Buffer.from(response.data)
}