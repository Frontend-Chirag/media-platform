import { NextRequest, NextResponse } from 'next/server';
import { User } from "@/Schemas/userSchema";
import jwt from 'jsonwebtoken';
import { ConnectedToDatabase } from '@/DB/databaseConnection';

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
    await    ConnectedToDatabase();

        // Get user ID from cookies
        const token = request.cookies.get('accessToken')?.value || '';
        const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;

        const userId = decordedToken?._id;

        // If user ID is not found, return a 402 status code
        if (!userId) {
            return NextResponse.json({ message: 'UserId not found' }, { status: 402 });
        }

        // Update user's profile picture to an empty string
        const user = await User.findByIdAndUpdate(userId, {
            profilePicture: ""
        });

        // If user is not found, return a 401 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 401 });
        }

        // Save the updated user
        await user.save();

        // Return a success message with a 201 status code
        return NextResponse.json({ message: 'Photo removed successfully' }, { status: 201 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to remove photo' }, { status: 500 });
    }
}
