import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import { getUserByCookies } from '@/utils/getUserByCookies';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Get user ID from cookies
        const userId = await getUserByCookies(request);

        // If user ID is not found, return a 401 status code
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
        }

        // Find the user by ID
        const user = await User.findOne({ _id: userId });

        // If user is not found, return a 404 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Create a response object
        const response = NextResponse;

        // Check if the user profile is complete
        const isProfileComplete = user.name !== '' && user.username !== ''
            && user.email !== '' && user.bio !== '' 
            && user.gender !== '';

        // Return appropriate response based on profile completeness
        if (!isProfileComplete) {
            return response.json({ message: 'Profile incomplete' }, { status: 201 });
        }

        // Return a success message with a 200 status code
        return response.json({ message: 'Profile is complete' }, { status: 200 });
    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Unable to get user' }, { status: 500 });
    }
}
