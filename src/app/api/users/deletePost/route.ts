import { Post } from '@/Schemas/postSchema';
import { User } from '@/Schemas/userSchema';
import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';


export async function DELETE(req: NextRequest) {
    try {
        await ConnectedToDatabase();
        const postId = req.nextUrl.searchParams.get('postId') as string;
        const userId = req.nextUrl.searchParams.get('userId') as string;

        if (!(postId && userId)) {
            return new Error('Failed to get userId and postId')
        }

        const user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $pull: {
                    posts: postId
                }
            },
            { new: true }
        );

        if (!user) {
            return new Error('Failed to find user ')
        }

        const post = await Post.findByIdAndDelete(postId);

        if (!post) {
            return new Error('Failed to find user ')
        }

        return NextResponse.json({ id: user?._id, message: 'post deleted successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to Delete post' }, { status: 500 })
    }
}