import { Post } from '@/Schemas/postSchema';
import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';


export async function PATCH(req: NextRequest) {
    try {
        await ConnectedToDatabase();

        const reqBody = await req.json();
        const { postId, userId, isSave } = reqBody;

        if (!isSave) {
            await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $addToSet: { savePosts: userId }
                },
                { new: true }
            )
        } else {
            await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $pull: { savePosts: userId }
                },
                { new: true }
            )
        }

        return NextResponse.json({ id: postId, message: 'save or unSave post successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        NextResponse.json({ message: 'Failed to save or unSave post' }, { status: 500 })
    }
}