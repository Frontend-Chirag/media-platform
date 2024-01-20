import { NextRequest, NextResponse } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        ConnectedToDatabase();

        // Retrieve all users from the database, excluding sensitive information
        const usersCollection = await User.find({}).select('-password -refreshToken').exec();

        // Return a JSON response with the users and a 200 status code
        return NextResponse.json(usersCollection, { status: 200 });
    } catch (error) {
        // Log any errors to the console
        console.log(error);

        // Return an error message with a 500 status code
        return NextResponse.json({ message: 'Error getting users' }, { status: 500 });
    }
}
