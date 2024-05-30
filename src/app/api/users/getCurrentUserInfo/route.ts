import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        await ConnectedToDatabase();

        const token = request.cookies.get('accessToken')?.value || '';

        let tokenState = false;
        
        const { exp } = jwt.decode(token) as jwt.JwtPayload;
        const isAccessTokenExpired = exp! * 1000 < Date.now();

        if (isAccessTokenExpired) {

            tokenState = true;

            return NextResponse.json({ user: {}, tokenState: tokenState }, { status: 200 });

        } else {
            const decordedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
            // Find the user by ID and exclude sensitive information
            const user = await User.findById(decordedToken?._id).select('-password -refreshToken');

            // If user is not found, return a 404 status code
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
            // Return user information and token state with a 200 status code
            return NextResponse.json({ user: user, tokenState: tokenState }, { status: 200 });

        }

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to get Current User Info' }, { status: 500 });
    }
}
