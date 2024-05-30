import { NextRequest, NextResponse } from 'next/server';
import { Conversation } from '@/Schemas/conversationSchema';


export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const { currentUserId, userId, isGroup, members, name } = body;

        if (!currentUserId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // if (!isGroup && (!members || members.length < 2 || !name)) {
        //     return new NextResponse('Invalid data', { status: 400 })
        // }

        // if (!isGroup) {
        //     return new NextResponse('req for group conversations', { status: 200 })
        // }


        const existingConversations = await Conversation.find({
            $or: [
                { userIds: { $eq: [currentUserId, userId] } },
                { userIds: { $eq: [userId, currentUserId] } }
            ]
        }).populate({
            path: 'users',
            select: '_id username name profilePicture'
        });



        const singleConversation = existingConversations[0];


        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }


        const newConversation = await Conversation.create({
            userIds: [currentUserId, userId]
        });

        // Populate user data
        await newConversation.populate({
            path: 'users',
            select: '_id username name profilePicture'
        });


        console.log('newConversation', newConversation)

        return NextResponse.json(newConversation)

    } catch (error) {
        console.log(error);
        return NextResponse.json('Internal Error', { status: 500 })
    }
}