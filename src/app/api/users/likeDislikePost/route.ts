import { Post } from '@/Schemas/postSchema';
import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';


export async function PATCH(req: NextRequest) {
    try {
        await ConnectedToDatabase();

        const reqBody = await req.json();
        const { postId, userId, isLike } = reqBody;

        if (!isLike) {
            await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $addToSet: { likes: userId }
                },
                { new: true }
            )
        } else {
            await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $pull: { likes: userId }
                },
                { new: true }
            )
        }

        return NextResponse.json({ id: postId, message: 'Like or Unlike post successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        NextResponse.json({ message: 'Failed to like or unlike post' }, { status: 500 })
    }
}