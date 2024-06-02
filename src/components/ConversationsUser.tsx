"use client";

import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch';
import { useUser } from '@/libs/useUser';
import { getConversationsUser } from '@/queries/quriesAndmutations';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import { IUseFullMessageType } from './MessageBody';
import { format } from 'date-fns';
import ConversationBox from './ConversationBox';
import { pusherClient } from '@/utils/pusher';

export interface IUseConversationUserList {
    _id: string
    lastMessageAt: Date,
    messageIds: string[],
    userIds: string[],
    createdAt: Date,
    updatedAt: Date,
    message: IUseFullMessageType[]
    users: [{
        _id: string,
        username: string,
        name: string,
        profilePicture: string,
    }],
}

const ConversationsUser = () => {

    const { user } = useUser();

    const [conversationsUserList, setConversationUserList] = useState<IUseConversationUserList[]>([]);

    const fetchCurrentUserConversationList = async () => {
        try {

            const res = await axios.get('/api/users/getAllConversationsList', { params: { currentUserId: user?._id } });
           
            setConversationUserList(res?.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCurrentUserConversationList()
    }, [user?._id]);


    useEffect(() => {

        if (!user?._id) {
            return;
        };

        pusherClient.subscribe(`${user?._id}`);

        const updatehandler = (conversation: IUseConversationUserList) => {
            setConversationUserList((current) => current.map((currentConversation) => {
                if(currentConversation._id === conversation._id){
                     console.log('working')
                    return {
                        ...currentConversation,
                        message: conversation.message
                    }
                 }

                 return currentConversation;
            }))
        }

        pusherClient.bind('conversation:update', updatehandler);

        return () => {
            pusherClient.unsubscribe(`${user?._id}`);
            pusherClient.unbind('conversation:update', updatehandler)
        }
    }, [user?._id])

    return (
        <div className='w-full h-auto '>
            {conversationsUserList.length !== 0 && (
                conversationsUserList.map((conversationUser) => (
                    <ConversationBox
                        data={conversationUser}
                    />
                ))
            )}
        </div>
    )
}

export default ConversationsUser