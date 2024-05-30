import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';
import mongoose from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Connect to the database
        await ConnectedToDatabase();

        // Get the userId from the request URL
        const userId = req.nextUrl.searchParams.get('userId') as string;
        console.log(userId)

        const tweets = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "userId",
                    as: "postsData",
                },
            },
            // Unwind the postsData array for processing
            {
                $unwind: "$postsData",
            },
            {
                $group: {
                    _id: "$_id",
                    tweets: {
                        $push: {
                            $cond: {
                                if: { $eq: ["$postsData.media", []] },
                                then: "$postsData",
                                else: null,
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    tweets: {
                        $filter: {
                            input: "$tweets",
                            as: "tweet",
                            cond: { $ne: ["$$tweet", null] },
                        },
                    },
                },
            },
        ]
        )

        // Aggregate pipeline to fetch posts and tweets for the user
        const posts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },        
              {
                $unwind: "$posts",
              },
              {
                $sort: {
                  "posts.createdAt": -1,
                },
              },
              {
                $lookup: {
                  from: "posts",
                  localField: "posts.postId",
                  foreignField: "_id",
                  as: "postsData",
                },
              },
              {
                $unwind: "$postsData",
              },
              {
                $sort: {
                  "postsData.isPinned": -1,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "postsData.userId",
                  foreignField: "_id",
                  as: "userData",
                },
              },
              {
                $unwind: "$userData",
              },
              {
                $group: {
                  _id: "$_id",
                  posts: {
                    $push: {
                      _id: "$postsData._id",
                      caption: "$postsData.caption",
                      audio: "$postsData.audio",
                      comments: "$postsData.comments",
                      likes: "$postsData.likes",
                      savePosts: "$postsData.savePosts",
                      reposts: "$postsData.reposts",
                      media: "$postsData.media",
                      userId: "$postsData.userId",
                      isPinned: "$postsData.isPinned",
                      createdAt: "$postsData.createdAt",
                      updatedAt: "$postsData.updatedAt",
                      userData: {
                        name: "$userData.name",
                        username: "$userData.username",
                        profilePicture:"$userData.profilePicture",
                        _id: "$userData._id",
                      },
                    },
                  },
                },
               },
        ]);
        
        // Return the aggregated posts data with a success message and status code
        return NextResponse.json({ posts, tweets, message: 'successfully get all Posts' }, { status: 201 })
    } catch (error) {
        // Handle any errors and return an error response
        console.log(error);
        return NextResponse.json({ message: 'Failed to get all posts' }, { status: 500 });
    }
}




// [
    // {
    //   $lookup: {
    //     from: "posts",
    //     localField: "_id",
    //     foreignField: "userId",
    //     as: "postsData",
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "posts",
    //     localField: "_id",
    //     foreignField: "reposts",
    //     as: "repostsData",
    //   },
    // },
  
    // {
    //   $unwind: "$repostsData",
    // },
    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "repostsData.userId",
    //     foreignField: "_id",
    //     as: "userdata",
    //   },
    // },
    // {
    //   $unwind: "$userdata",
    // },
    // {
    //   $sort: {
    //     "repostsData.updatedAt": -1,
    //   },
    // },
    // {
    //   $project: {
    //     repostsData: {
    //       caption: 1,
    //       audio: 1,
    //       comments: 1,
    //       likes: 1,
    //       savePosts: 1,
    //       reposts: 1,
    //       media: 1,
    //       userId: 1,
    //       isPinned: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //     },
    //     userdata: {
    //       name: 1,
    //       username: 1,
    //       profilePicture: 1,
    //       _id: 1,
    //     },
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$_id",
    //     mergedData: {
    //       $push: {
    //         repostsData: "$repostsData",
    //         userdata: "$userdata",
    //       },
    //     },
    //   },
    // },
  
    // {
    //   $project: {
    //     mergeData: {
    //       $concatArrays: [
    //         "$repostsData",
    //         "$postsData",
    //       ],
    //     },
    //   },
    // },
    // {
    //   $unwind: "$mergeData",
    // },
    // {
    //   $match: {
    //     "mergeData.media": { $ne: [] },
    //   },
    // },
  
    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "mergeData.userId",
    //     foreignField: "_id",
    //     as: "userdata",
    //   },
    // },
    // {
    //   $unwind: "$userdata",
    // },
  
    // {
    //   $project: {
    //     mergeData: {
    //       caption: 1,
    //       audio: 1,
    //       comments: 1,
    //       likes: 1,
    //       savePosts: 1,
    //       reposts: 1,
    //       media: 1,
    //       userId: 1,
    //       isPinned: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //     },
    //     userdata: {
    //       name: 1,
    //       username: 1,
    //       profilePicture: 1,
    //       _id: 1,
    //     },
    //   },
    // },
  
    // {
    //   $group: {
    //     _id: "$_id",
    //     posts: {
    //       $push: "$mergeData",
    //     },
    //   },
    // },
//   ]





