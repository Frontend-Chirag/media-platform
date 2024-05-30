import { NextRequest, NextResponse } from 'next/server';
import { ConnectedToDatabase } from "@/DB/databaseConnection";
import { User } from "@/Schemas/userSchema";

export async function GET(req: NextRequest, params: { params: { id: string } }) {
    try {
        // Connect to the database
     await  ConnectedToDatabase();

        // Extract the user ID from url
        const url = new URL(req.url);

        const id = url.searchParams.get('id')

        // Find the user by ID and exclude sensitive information
        const user = await User.findOne({ _id: id }).select('-password -refreshToken');

        // If user is not found, return a 404 status code
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Return user information with a 200 status code
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
    }
}
