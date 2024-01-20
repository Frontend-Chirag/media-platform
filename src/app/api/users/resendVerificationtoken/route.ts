import { User } from "@/Schemas/userSchema";
import { sendMail } from "@/utils/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse the request body as JSON
        const reqBody = await request.json();
        const { email } = reqBody;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user is not found, return a 401 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 401 });
        }

        // Check if the user is already verified
        const isVerified = await user.isVerified === true;

        // If the user is already verified, return a 200 status code
        if (isVerified) {
            return NextResponse.json({ message: 'User already verified' }, { status: 200 });
        }

        // Generate a new verification token
        const verificationToken = await user.generateVerifyEmailToken();

        // Set the new verification token to the user
        user.verifyEmailToken = verificationToken;

        // Send a verification email with the new token
        await sendMail({
            email,
            emailType: 'verify',
            verificationToken
        });

        // Save the user with the updated verification token
        await user.save();

        // Return a success message with a 201 status code
        return NextResponse.json({ message: 'Resending Verification email sent' }, { status: 201 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Error in Resending verification email' }, { status: 500 });
    }
}
