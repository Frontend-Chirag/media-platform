import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/Schemas/userSchema';
import { Conversation } from '@/Schemas/conversationSchema';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {

        const currentUserId = req.nextUrl.searchParams.get('currentUserId') as string;

        if (!currentUserId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const conversationsList = await Conversation.find({
            userIds: currentUserId
        })
        .sort({lastMessageAt: -1})
        .populate({
            path: 'users',
            select: '_id username name profilePicture'
        })
        .populate( {
            path: 'message',
            populate:[
                {
                    path: 'sender',
                    select: '_id username name profilePicture'
                },
                {
                    path: 'seen',
                    select: '_id username name profilePicture'
                }
            ]
        });

        console.log('conversationsList',conversationsList)

        return NextResponse.json(conversationsList)

    } catch (error) {
        console.log(error);
        return NextResponse.json('Failed to get List of all Conversation', { status: 500 })
    }
}