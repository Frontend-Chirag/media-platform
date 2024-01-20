import { NextRequest, NextResponse } from 'next/server';
import { User } from "@/Schemas/userSchema";
import { getUserByCookies } from '@/utils/getUserByCookies';
import { ConnectedToDatabase } from '@/DB/databaseConnection';

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await ConnectedToDatabase();

        // Parse the request body as JSON
        const reqBody = await request.json();

        // Extract relevant data from the request body
        const { bio } = reqBody;

        // Retrieve user ID from cookies
        const userId = await getUserByCookies(request);

        // If user ID is not found, return a 402 status code
        if (!userId) {
            return NextResponse.json({ message: 'UserId not found' }, { status: 402 });
        }

        // Find the user by ID and update the bio
        const user = await User.findByIdAndUpdate(userId, { bio: bio });

        // If user is not found, return a 404 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Save the updated user information
        await user.save();

        // Return a success message with a 200 status code
        return NextResponse.json({ message: 'Bio Updated Successfully' }, { status: 200 });
    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to update bio' }, { status: 500 });
    }
}
