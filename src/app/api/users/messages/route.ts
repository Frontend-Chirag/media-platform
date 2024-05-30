import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/Schemas/messageSchema';
import { Conversation } from '@/Schemas/conversationSchema';
import { pusherServer } from '@/utils/pusher';


export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { currentUser, conversationId, image, message } = body;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        };

        const newMessage = await Message.create({
            body: message,
            image: image,
            seenIds: [currentUser],
            conversationId: conversationId,
            senderId: currentUser
        });

        const getMessage = await Message.findById(newMessage._id)
            .populate({
                path: 'sender',
                select: '_id username name profilePicture'
            })
            .populate({
                path: 'seen',
                select: '_id username name profilePicture'
            });


        const updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $set: { lastMessageAt: new Date() },
                $push: { messageIds: getMessage._id }
            },
            { new: true }
        ).populate('users')
            .populate({
                path: 'message',
                populate: {
                    path: 'seen',
                    model: 'User'
                }
            });

        await pusherServer.trigger(conversationId, 'message:new', getMessage);

        // const lastMessage = updatedConversation.message[updatedConversation.message.length - 1];

        // updatedConversation.users.map((user: any) => {
        //     pusherServer.trigger(user._id, 'conversation-update', {
        //         id: conversationId,
        //         message: [lastMessage]
        //     })
        // });


        return NextResponse.json(getMessage)

    } catch (error) {
        console.log(error);
        return new NextResponse('Failed to send Message', { status: 500 })
    }
}