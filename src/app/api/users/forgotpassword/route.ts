import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import { sendMail } from '@/utils/mailer';

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
       await ConnectedToDatabase();

        // Parse the request body as JSON
        const reqBody = await request.json();

        // Extract relevant data from the request body
        const { email } = reqBody;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user is not found, show an error toast message
        if (!user) {
            return NextResponse.json({message: 'user not found'}, {status: 401})
        }

        // Generate a forgot password token for the user
        const forgotPasswordToken = await user.generateForgotPasswordToken();

        if(!forgotPasswordToken){
            throw new Error;
        }
        console.log('forgotPasswordToken')

        // Send a reset password email to the user
        await sendMail({
            email,
            emailType: 'resetpassword',
            forgotPasswordToken
        });

        // Save the user with the new forgot password token
        await user.save();

        // Create a JSON response with a success message and a 200 status code
        const response = NextResponse.json({ message: 'Forgot password Token set in cookies' }, { status: 200 });

        // Set the forgotPasswordToken in cookies with httpOnly flag
        response.cookies.set('forgotPasswordToken', forgotPasswordToken, { httpOnly: true });

        // Return the response
        return response;
    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
