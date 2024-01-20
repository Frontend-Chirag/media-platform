import { NextRequest, NextResponse } from 'next/server';
import { User } from "@/Schemas/userSchema";
import { ConnectedToDatabase } from "@/DB/databaseConnection";
import { generateAccessAndRefreshToken } from '@/utils/generateAccessAndRefreshToken';

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Get email and password from the request body
        const reqBody = await request.json();

        // Destructure email and password
        const { email, password } = reqBody;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user is not found, return a 404 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if the password is correct
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        // If password is incorrect, return a 401 status code
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate access token and refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString());

        // Log the refresh token (for debugging purposes)
        console.log('refreshToken', refreshToken);

        // Create a response object
        const response = NextResponse.json({ message: 'Logged In', accessToken, refreshToken }, { status: 200 });

        // Set the tokens in cookies with httpOnly and secure flags
        response.cookies
            .set('refreshToken', refreshToken, { httpOnly: true, secure: true })
            .set('accessToken', accessToken, { httpOnly: true, secure: true });

        // Check if the user profile is complete
        const isProfileComplete = user.name && user.username && user.email && user.bio && user.profilePicture;

        // If profile is incomplete, return a 201 status code
        if (!isProfileComplete) {
            return NextResponse.json({ message: 'Profile incomplete' }, { status: 201 });
        }

        // Return the response
        return response;

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to log in' }, { status: 500 });
    }
}
