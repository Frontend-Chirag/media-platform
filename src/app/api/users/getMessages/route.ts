import { NextResponse, NextRequest } from 'next/server';
import { Message } from '@/Schemas/messageSchema';

export async function GET(req: NextRequest) {
    try {

        const conversationId = req.nextUrl.searchParams.get('conversationId') as string;

        const messages = await Message.find({ conversationId })
            .populate({
                path: 'sender',
                select: '_id username name profilePicture'
            })
            .populate({
                path: 'seen',
                select: '_id username name profilePicture'
            })
            .sort({ createdAt: 'asc' });


        return NextResponse.json(messages)

    } catch (error) {
        console.log(error);
        return NextResponse.json('Failed to get messages', { status: 500 })
    }
}
