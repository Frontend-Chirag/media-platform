"use client";

import React from 'react'
import { IUseFullMessageType } from './MessageBody';
import { useUser } from '@/libs/useUser';
import { format } from 'date-fns';
import Image from 'next/image';


interface MessageBoxProps {
    messagedata: IUseFullMessageType,
    isLast?: boolean,
}

const MessageBox: React.FC<MessageBoxProps> = ({ messagedata, isLast }) => {

    const { user } = useUser();

    const isOwn = user?._id === messagedata.senderId;
    const seenList = (messagedata.seen || [])
        .filter((user) => user._id !== messagedata.sender._id)
        .map((user) => user.name)
        .join(',')

    return (
        <div className={`w-auto h-auto gap-3 flex ${isOwn ? 'justify-end mr-2' : 'justify-start ml-2'} mb-5  `}>
            <div className='flex flex-col justify-end'>
                <div className={` rounded-tl-3xl rounded-tr-3xl flex justify-center items-center rounded-bl-3xl w-auto h-auto rounded-br-md ${isOwn ? 'bg-[#2f8bfc] text-white' : 'dark:bg-[#2a3240] dark:text-white bg-gray-300 text-black'}   fontsfamily p-4 text-[18px] font-semibold`}>
                    {messagedata.image &&
                        <div className='w-[320px] h-[320px] rounded-xl '>
                            <Image
                                src={messagedata.image}
                                fill
                                alt='image'
                            />
                        </div>
                    }
                    <p>{messagedata.body}</p>
                </div>
                <div className="text-xs flex justify-end mt-1 dark:text-neutral-400 text-gray-200 gap-1">
                    <p>At</p>
                    {format(new Date(messagedata.createdAt), 'p')}
                    {isLast && isOwn && seenList &&
                        <p>. seen</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default MessageBox