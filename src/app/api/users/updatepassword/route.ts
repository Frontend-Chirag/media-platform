import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Parse the request body as JSON
        const reqBody = await request.json();

        // Destructure confirmPassword from the request body
        const { confirmPassword } = reqBody;

        // Encrypt the confirmPassword using bcrypt
        const encryptedPassword = await bcrypt.hash(confirmPassword, 12);

        // Get the forgotPasswordToken from cookies
        const forgotPasswordToken = request.cookies.get('forgotPasswordToken')?.value || '';

        // If forgotPasswordToken is not found, return a 400 status code
        if (!forgotPasswordToken) {
            return NextResponse.json({ message: 'Invalid Token Access for forgotPassword' }, { status: 400 });
        }

        // Decode the forgotPasswordToken
        const decodedToken = jwt.verify(forgotPasswordToken, process.env.FORGOT_PASSWORD_SECRET!) as jwt.JwtPayload;

        // Update the user's password
        const user = await User.findByIdAndUpdate(
            decodedToken._id,
            {
                password: encryptedPassword
            },
            {
                new: true,
                runValidators: true
            }
        );

        // Save the updated user
        await user.save();

        // Create a response object with a success message and a 200 status code
        const response = NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

        // Clear the forgotPasswordToken cookie
        response.cookies.set('forgotPasswordToken', "", { httpOnly: true, secure: true });

        // Return the response
        return response;

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Error in updating password' }, { status: 500 });
    }
}
