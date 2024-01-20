import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import { getUserByCookies } from '@/utils/getUserByCookies';

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        await ConnectedToDatabase();

        // Get user information from cookies
        const userId = await getUserByCookies(request);

        // Check if the token is expired
        if (userId?.tokenState === true && userId?._id === '') {
            console.log('Token is expired');
            // Return an empty user object and token state with a 200 status code
            return NextResponse.json({ user: {}, tokenState: userId?.tokenState }, { status: 200 });
        }

        // Find the user by ID and exclude sensitive information
        const user = await User.findById(userId?._id).select('-password -refreshToken');

        // If user is not found, return a 404 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Return user information and token state with a 200 status code
        return NextResponse.json({ user: user, tokenState: userId?.tokenState }, { status: 200 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to get Current User Info' }, { status: 500 });
    }
}
