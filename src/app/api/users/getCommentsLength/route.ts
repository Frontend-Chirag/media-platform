import { NextResponse, NextRequest } from 'next/server';
import { Post } from '@/Schemas/postSchema';


export async function GET(req: NextRequest) {
    try {

        const postId = req.nextUrl.searchParams.get('postId');

        const comments = await Post.findById(postId);

        if (!comments) {
            throw new Error('Failed get Post by id to get likes')
        }

        return NextResponse.json({ comments: comments.comments, message: 'Updated likes get successfulyy' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to get like' }, { status: 500 })
    }
}