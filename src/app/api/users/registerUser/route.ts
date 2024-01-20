import { ConnectedToDatabase } from "@/DB/databaseConnection";
import { User } from "@/Schemas/userSchema";
import { useUserEmail } from "@/utils/getUserEmail";
import { sendMail } from "@/utils/mailer";
import { NextRequest, NextResponse } from 'next/server';
import toast from "react-hot-toast";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Get user data from frontend or request body
        const reqBody = await request.json();

        // Destructure data from the request body
        const { name, email, password, username } = reqBody;

        // Validate user data for non-empty fields
        if ([name, email, password].some((fields) => fields?.trim() === '')) {
            return toast.error('Please fill all the fields');
        }

        // Check if user already exists by name or email
        const existingUser = await User.findOne({
            $or: [{ name }, { email }]
        });

        // If user exists, return an error
        if (existingUser) {
            return toast.error('User already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            username,
        });

        // Remove password and refresh token field from the response
        const createdUser = await User.findById(user._id).select('-password -refreshToken');

        // If user is not created, return an error
        if (!createdUser) {
            return toast.error('User not created');
        }

        // Generate and set the verification token for email verification
        const verificationToken = await user.generateVerifyEmailToken();
        user.verifyEmailToken = verificationToken;

        // Send verification email
        await sendMail({
            email,
            emailType: 'verify',
            verificationToken
        });

        // Save the user with the verification token
        await user.save();

        // Return a success message with a 200 status code
        return NextResponse.json({ message: 'User created successfully' }, { status: 200 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
}
