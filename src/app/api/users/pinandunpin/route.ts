import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { Post } from '@/Schemas/postSchema';
import { NextResponse, NextRequest } from 'next/server';


export async function PATCH(req: NextRequest) {
    try {

        await ConnectedToDatabase()

        const reqBody = await req.json();

        const { isPinned, postId, userId } = reqBody;

        if (!(postId )) {
            return new Error('Failed to get pin PostId');
        }

        if (isPinned) {
            await Post.findByIdAndUpdate(
                { _id: postId },
                { $set: { isPinned: true } },
                { new: true }
            )
        }else {
             await Post.findByIdAndUpdate(
                { _id: postId },
                { $set: { isPinned: false } },
                { new: true }
            )
        }
        return NextResponse.json({ data: {postId: postId, userId: userId }, message: 'Post is Pin or Unpin  successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed Pin or Unpin Post' }, { status: 500 })
    }
}