import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/Schemas/userSchema';
import jwt from 'jsonwebtoken';
import { generateAccessAndRefreshToken } from '@/utils/generateAccessAndRefreshToken';

export async function POST(req: NextRequest) {
    try {
        // Retrieve the existing refresh token from cookies
        const existingRefreshToken = req.cookies.get('refreshToken')?.value || '';
        let refreshTokenState = false;

        // Decode the existing refresh token to check its expiration
        const { exp } = jwt.decode(existingRefreshToken) as jwt.JwtPayload;
        const isExistingRefreshTokenExpired = exp! * 1000 < Date.now();

        if (isExistingRefreshTokenExpired) {
            refreshTokenState = true;
            console.log('RefreshToken Is Expired');

            // Return a response indicating the expired refresh token with a 200 status code
            return NextResponse.json({ refreshTokenState }, { status: 200 });
        } else {
            // Verify the existing refresh token and get the user ID
            const decodedExistingRefreshToken = jwt.verify(existingRefreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
            const user = await User.findById(decodedExistingRefreshToken?._id);

            // Generate new access and refresh tokens
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

            // Create a JSON response with the new tokens and a 200 status code
            const response = NextResponse.json({ accessToken, refreshToken }, { status: 200 });

            // Set the new tokens in cookies with httpOnly and secure flags
            response.cookies
                .set('refreshToken', refreshToken, { httpOnly: true, secure: true })
                .set('accessToken', accessToken, { httpOnly: true, secure: true });

            // Return the response
            return response;
        }
    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to get New AccessToken' }, { status: 500 });
    }
}
