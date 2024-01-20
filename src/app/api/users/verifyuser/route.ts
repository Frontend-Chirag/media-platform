import { NextResponse, NextRequest } from 'next/server';
import { User } from "@/Schemas/userSchema";
import { ConnectedToDatabase } from "@/DB/databaseConnection";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Get the referer header from the request
        const referer = request.headers.get('referer');

        // Initialize a URL object with the referer value
        let url: URL | null = null;

        // If referer is available, create a URL object
        if (referer) {
            url = new URL(referer);
        } else {
            // Handle the error when referer is null
            return NextResponse.json({ message: 'Invalid Referer' }, { status: 400 });
        }

        // Extract the token parameter from the query string
        const params = new URLSearchParams(url.search);
        const token = params.get('token');

        // Find the user with the given verifyEmailToken
        const user = await User.findOne({
            verifyEmailToken: token
        });

        // If user is not found, return a 400 status code
        if (!user) {
            return NextResponse.json({ message: 'Invalid Token' }, { status: 400 });
        }

        // Update user's verification status and clear the token
        user.isVerified = true;
        user.verifyEmailToken = null;

        // Save the updated user
        await user.save();

        // Return a success message with a 200 status code
        return NextResponse.json({ message: 'Email Verified' }, { status: 200 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 400 status code
        return NextResponse.json({ message: 'Unable to Verify Email' }, { status: 400 });
    }
}
