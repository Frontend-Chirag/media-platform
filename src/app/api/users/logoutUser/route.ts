import { ConnectedToDatabase } from "@/DB/databaseConnection"
import { User } from "@/Schemas/userSchema";
import { getUserByCookies } from "@/utils/getUserByCookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Get user ID from cookies
        const userId = await getUserByCookies(request);

        // If user ID is not found, return a 401 status code
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
        }

        // Update the user's refreshToken to an empty string
        const user = await User.findByIdAndUpdate(userId,
            {
                $set: {
                    refreshToken: ''
                }
            },
            { new: true }
        );

        // Log the updated user information (for debugging purposes)
        console.log(user);

        // Create a response object
        const response = NextResponse.json({ message: 'User logged out successfully' }, { status: 200 });

        // Clear the accessToken and refreshToken cookies
        response.cookies
            .set('accessToken', "", { httpOnly: true, secure: true })
            .set('refreshToken', "", { httpOnly: true, secure: true });

        // Return the response
        return response;

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
