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
    const { data: res } = getConversationsUser(user?._id!);
    const [conversationsUserList, setConversationUserList] = useState<IUseConversationUserList[]>([]);

    useEffect(() => {
        if (res?.data) {
            console.log('ConversationListUser', res?.data)
            setConversationUserList(res?.data)
        }
    }, [res?.data]);


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