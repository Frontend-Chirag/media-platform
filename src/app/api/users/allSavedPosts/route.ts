import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/Schemas/userSchema';
import { SavePosts } from '@/Schemas/savePostSchems';

export async function GET(req: NextRequest) {
    try {

        const currentUserId = req.nextUrl.searchParams.get('currentUserId') as string;

        const allSavedPosts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(currentUserId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "savePosts",
                    as: "savePostdata",
                },
            },
            {
                $unwind: '$savePostdata'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'savePostdata.userId',
                    foreignField: '_id',
                    as: 'userdata'
                }
            },
            {
                $unwind: '$userdata'
            },
            {
                $project: {
                    userdata: {
                        name: -1,
                        username: -1,
                        profilePicture: -1,
                        _id: -1
                    },
                    savePostdata: {
                        _id: -1,
                        caption: -1,
                        audio: -1,
                        comments: -1,
                        likes: -1,
                        savePosts: -1,
                        reposts:-1,
                        media: -1,
                        userId: -1,
                        isPinned: -1,
                        createdAt: -1,
                        updatedAt: -1,
                    }
                }
            },
        ]);

        return NextResponse.json({ allSavedPosts, message: 'Successfully able to get all save post' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ mesaage: 'Failed to get all SavedPosts' }, { status: 500 })
    }
}