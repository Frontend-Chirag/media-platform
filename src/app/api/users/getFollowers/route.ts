import { User } from '@/Schemas/userSchema';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {

        

        const _id = req.nextUrl.searchParams.get("_id") as string;
        const searchQuery = req.nextUrl.searchParams.get("searchQuery") as string;
        console.log(searchQuery)
        console.log('_id', _id)

        if (searchQuery) {
            const followersPepline = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: 'followers',
                        foreignField: '_id',
                        as: "data"
                    }
                },
                {
                    $unwind: "$data"
                },
                {
                    $project: {
                        data: {
                            username: 1,
                            name: 1,
                            profilePicture: 1,
                            _id: 1,
                            friendRequests: 1,
                            followers: 1,
                            following: 1,
                            isPrivate: 1,
                        }
                    }
                },
                {
                    $match: {
                        $or: [
                            { 'data.username': { $regex: searchQuery.toString() } },
                            { 'data.name': { $regex: searchQuery.toString() } },
                        ]
                    }
                }
            ]);

            console.log("followersPepline", followersPepline);
            return NextResponse.json(followersPepline, { status: 201 });

        } else {

            const followersPepline = await User.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: 'followers',
                        foreignField: '_id',
                        as: "data"
                    }
                },
                {
                    $unwind: "$data"
                },
                {
                    $project: {
                        data: {
                            username: 1,
                            name: 1,
                            profilePicture: 1,
                            _id: 1,
                            friendRequests: 1,
                            followers: 1,
                            following: 1,
                            isPrivate: 1,
                        }
                    }
                },
            ]);

            return NextResponse.json(followersPepline, { status: 201 })
        }



    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to get followers' }, { status: 500 })
    }
}