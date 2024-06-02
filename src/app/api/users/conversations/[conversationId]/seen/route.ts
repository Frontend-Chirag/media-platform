import { Conversation } from "@/Schemas/conversationSchema";
import { Message } from "@/Schemas/messageSchema";
import { pusherServer } from "@/utils/pusher";
import { NextRequest, NextResponse } from "next/server";;

interface IParams {
    conversationId?: string;
}

export async function POST(req: NextRequest, { params }: { params: IParams }) {
    try {

        const reqBody = await req.json();
        const { currentUserId } = reqBody;

        if (!currentUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        };

        const { conversationId } = params;

        // Find the existing conversation

        const conversation = await Conversation.findOne({ _id: conversationId })
            .populate({
                path: 'message',
                populate: {
                    path: 'seen',
                    select: '_id username name profilePicture'
                }
            })
            .populate({
                path: 'users',
                select: '_id username name profilePicture'
            });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // Find the last Message
        const lastMessage = conversation.message[conversation.message.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation)
        }

        // update seen of last message;
        const updatedMessage = await Message.findByIdAndUpdate(
            lastMessage._id,
            {
                $addToSet: { seenIds: currentUserId } // Add currentUser to the 'seenIds' array
            },
            {
                new: true
            }
        )
            .populate('sender', '_id username name profilePicture')
            .populate('seen', '_id username name profilePicture');


        await pusherServer.trigger(currentUserId, 'conversation:update', {
            _id: conversationId,
            message: [updatedMessage]
        });

        if (lastMessage.seenIds.indexOf(currentUserId) === -1) {
            return NextResponse.json(conversation)
        };

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

        return NextResponse.json(updatedMessage)

    } catch (error) {
        console.log(error, 'ERROR_MESSAGES');
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}