import { User } from '@/Schemas/userSchema';
import { uploadOnCloudinary } from '@/utils/cloudinary';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import { getUserByCookies } from '@/utils/getUserByCookies';
import { ConnectedToDatabase } from '@/DB/databaseConnection';

// export const config = {
//   api: {
//     parser: false,
//   }
// }

export async function POST(request: NextRequest) {
  try {
    await ConnectedToDatabase()
    // Parse the form data
    const reqBody = await request.formData();

    // Get the profilePicture file from the form data
     const imageFile: File | null = reqBody.get('profilePicture') as unknown as File;

    // If no file is found, return a 400 status code
    if (!imageFile) {
      return NextResponse.json({ message: 'No file found' }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to a temporary location
    const path = join('./public/temp', imageFile.name);
    await writeFile(path, buffer);

    // Upload the file to Cloudinary and get the image URL
    const imageUrl = await uploadOnCloudinary(path);

    // Get the user ID from cookies
    const userId =  await getUserByCookies(request);
    
    // Update the user's profile picture with the new URL
    const user = await User.findByIdAndUpdate(userId, {
      profilePicture: imageUrl
    });

    // If user is not found, return a 401 status code
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    // Save the updated user
    await user.save();

    // Return a success message with a 201 status code
    return NextResponse.json({ message: 'Image updated successfully' }, { status: 201 });

  } catch (error) {
    // Log any errors to the console
    console.log(error);

    // Return an error message with a 500 status code
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
