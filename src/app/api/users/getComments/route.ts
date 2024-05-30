import { Post } from '@/Schemas/postSchema';
import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
    try {

        const postId = req.nextUrl.searchParams.get('postId') as string;

        const comments = await Post.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(postId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "comments",
                    foreignField: "_id",
                    as: "currentPostComments",
                },
            },
            {
                $unwind: "$currentPostComments",
            },
            {
                $sort: {
                    currentPostComments: -1,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "currentPostComments.userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $project: {
                    _id: '$currentPostComments._id',
                    caption: '$currentPostComments.caption',
                    comments: '$currentPostComments.comments',
                    likes: '$currentPostComments.likes',
                    savePosts: '$currentPostComments.savePosts',
                    reposts: '$currentPostComments.reposts',
                    media: '$currentPostComments.media',
                    userId: '$currentPostComments.userId',
                    parentPosts: '$currentPostComments.parentPosts',
                    createdAt: '$currentPostComments.createdAt',
                    updatedAt: '$currentPostComments.updatedAt',
                    userData: {
                        name: 1,
                        username: 1,
                        profilePicture: 1,
                        _id: 1,
                    },
                },
            },
        ])

        return NextResponse.json({ comments: comments, message: 'Successfully get comments' }, { status: 200 })

    } catch (error) {
        console.log(error);
        NextResponse.json({ message: 'Failed to get Comments' }, { status: 500 })
    }
}