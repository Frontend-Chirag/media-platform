import { Post } from '@/Schemas/postSchema';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {

        const postId = req.nextUrl.searchParams.get('postId') as string;

        if (!postId) {
            throw new Error('Error to get PostId')
        }

        const post = await Post.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(postId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $graphLookup: {
                    from: "posts",
                    startWith: "$parentPosts",
                    connectFromField: "parentPosts",
                    connectToField: "_id",
                    as: "parentPostsData",
                    maxDepth: 5,
                    depthField: "depth",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "parentPostsData.userId",
                    foreignField: "_id",
                    as: "parentUserData",
                },
            },
            {
                $addFields: {
                    parentPostsData: {
                        $map: {
                            input: {
                                $sortArray: {
                                    input: "$parentPostsData",
                                    sortBy: { createdAt: 1 }
                                }
                            },
                            as: "post",
                            in: {
                                $mergeObjects: [
                                    "$$post",
                                    {
                                        userData: {
                                            $arrayElemAt: [
                                                {
                                                    $map: {
                                                        input: "$parentUserData",
                                                        as: "user",
                                                        in: {
                                                            _id: "$$user._id",
                                                            name: "$$user.name",
                                                            username:
                                                                "$$user.username",
                                                            profilePicture:
                                                                "$$user.profilePicture",
                                                        },
                                                    },
                                                },
                                                {
                                                    $indexOfArray: [
                                                        "$parentUserData._id",
                                                        "$$post.userId",
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    audio: 1,
                    comments: 1,
                    likes: 1,
                    savePosts: 1,
                    reposts: 1,
                    media: 1,
                    userId: 1,
                    isPinned: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    parentPostsData: 1,
                    userData: {
                        name: 1,
                        username: 1,
                        profilePicture: 1,
                        _id: 1,
                    },
                },
            },


        ]);

        if (!post) {
            throw new Error('Error to get Post')
        }

        return NextResponse.json({ post: post, message: 'Successfully get post' }, { status: 200 })


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to get Post' }, { status: 500 })
    }
}
