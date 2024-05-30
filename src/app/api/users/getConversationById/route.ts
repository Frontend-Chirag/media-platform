import { NextRequest, NextResponse } from 'next/server';
import { Conversation } from '@/Schemas/conversationSchema';
import mongoose from 'mongoose';


export async function GET(req: NextRequest) {
    try {

        const conversationId = req.nextUrl.searchParams.get('conversationId') as string;

        const conversation = await Conversation.findById(conversationId)
        .populate({
            path: 'users',
            select: '_id username name profilePicture'
        });

        return NextResponse.json(conversation);

    } catch (error) {
        console.log(error);
        return NextResponse.json('Internal Error', { status: 500 })
    }
}