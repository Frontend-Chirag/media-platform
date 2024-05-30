import { Post } from '@/Schemas/postSchema';
import { NextResponse, NextRequest } from 'next/server';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { User } from '@/Schemas/userSchema';


export async function PATCH(req: NextRequest) {
    try {
        await ConnectedToDatabase();

        const reqBody = await req.json();
        const { postId, userId, isRepost } = reqBody;

        if (!isRepost) {
            const post = await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $addToSet: { reposts: userId },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            );
            if (!post) {
                return new Error('didn"t find post by its Id')
            }

            const user = await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        posts: {
                            postId: postId,
                            isRepost: true,
                            createdAt: Date.now()
                        }
                    }
                },
                { new: true }
            );

            if (!user) {
                return new Error('didn"t find user by its Id')
            }
            console.log('user', user)
        } else {
            const post = await Post.findByIdAndUpdate(
                { _id: postId },
                {
                    $pull: { reposts: userId }
                },
                { new: true }
            );
            if (!post) {
                return new Error('didn"t find post by its Id')
            }
            const user = await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $pull: {  posts: { postId: postId, isRepost: true }}
                },
                { new: true }
            );
            if (!user) {
                return new Error('didn"t find user by its Id')
            }
        }

        return NextResponse.json({ id: postId, message: 'repost or unrepost post successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        NextResponse.json({ message: 'Failed to repost or unrepost' }, { status: 500 })
    }
}