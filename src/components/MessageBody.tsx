"use client";

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import { pusherClient } from '@/utils/pusher';
import { find } from 'lodash';


export interface IUseFullMessageType {
    body: string,
    conversationId: string,
    _id: string,
    image: string,
    createdAt: Date,
    seen: [{
        _id: string,
        name: string,
        username: string,
        profilePicture: string
    }],
    seenIds: string[],
    sender: {
        _id: string,
        name: string,
        username: string,
        profilePicture: string
    },
    senderId: string,
    updatedAt: Date,
}

const MessageBody = ({ id }: { id: string }) => {

    const [intialMessages, setIntialMessages] = useState<IUseFullMessageType[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);


    const getMessages = async () => {
        await axios.get('/api/users/getMessages', { params: { conversationId: id } })
            .then((data) => {
                setIntialMessages(data?.data)
            })
    }

    useEffect(() => {
        getMessages()
    }, [id]);

    useEffect(() => {
        pusherClient.subscribe(id);
        bottomRef.current?.scrollIntoView();

        const messageHandlers = (message: IUseFullMessageType) => {
            setIntialMessages((current) => {
                if (find(current, { _id: message._id })) {
                    return current
                }

                return [...current, message]
            });

            bottomRef?.current?.scrollIntoView();
        }

        const updateMessageHandler = (newMessage: IUseFullMessageType) => {
            setIntialMessages((current) => current.map((currentMessage) => {
                if (currentMessage._id === newMessage._id) {
                    return newMessage
                }
                return currentMessage
            }));
        };

        pusherClient.bind('message:new', messageHandlers);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(id);
            pusherClient.bind('message:new', messageHandlers);
            pusherClient.bind('message:update', updateMessageHandler)
        };

    }, [id])


    return (
        <div className='w-full h-full text-white'>
            {intialMessages.map((message, i) => (
                <MessageBox
                    key={message._id}
                    isLast={i === intialMessages.length - 1}
                    messagedata={message}
                />
            ))}
            <div ref={bottomRef} className='pt-24' />
        </div>
    )
};

export default MessageBody;