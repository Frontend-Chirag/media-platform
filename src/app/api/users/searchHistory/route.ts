import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        await ConnectedToDatabase()

        const reqBody = await req.json();

        const { userId, searchUserId } = reqBody;

        const searchHistoryField = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { searchHistory: searchUserId } },
            {
                new: true
            }
        )

        // const searchHistoryagg = await User.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(userId)
        //         }
        //     },
        //     {
        //         $set: {
        //             searchHistory: [
        //                 searchUserId
        //             ]
        //         }
        //     },
        // //     // {
        // //     //     $lookup: {
        // //     //         from: "users",
        // //     //         localField: '_id',
        // //     //         foreignField: 'searchHistory',
        // //     //         as: "data"
        // //     //     }
        // //     // },
        // //     // {
        // //     //     $unwind: "$data"
        // //     // },
        // //     // {
        // //     //     $project: {
        // //     //         data: {
        // //     //             username: 1,
        // //     //             name: 1,
        // //     //             _id: 1,
        // //     //             profilePicture: 1
        // //     //         }
        // //     //     }
        // //     // }
        // ]);


        console.log(searchHistoryField);

        return NextResponse.json(searchHistoryField, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to add user in Search History' }, { status: 500 });
    }
}