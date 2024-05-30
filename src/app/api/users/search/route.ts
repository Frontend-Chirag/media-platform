import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {

        await ConnectedToDatabase()

        const searchQuery = req.nextUrl.searchParams.get("searchQuery") as string;

        console.log(searchQuery)

        const searchResult = await User.aggregate([
            {
                $match: {
                    $or: [
                        { 'username': { $regex: searchQuery.toString() } },
                        { 'name': { $regex: searchQuery.toString() } },
                    ]
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    username: 1,
                    name: 1,
                    _id: 1,
                    profilePicture: 1
                }
            }
        ]);

        return NextResponse.json(searchResult, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to Fetch Search user' }, { status: 500 });
    }

}