"use client";

import React, { useEffect } from 'react';
import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch'
import ConversationWrapper from './ConversationWrapper';

interface IUseConveration {
    id?: string
    type: 'ConversationId' | 'Conversation'
}

const ConversationsList = ({ id , type}: IUseConveration) => {

    const { onNewMessageUserSearchOpen,  setConversationId, setType} = useNewMessageUserSearch();

    useEffect(() => {
     setConversationId(id!)
    },[id])

    useEffect(() => {
     setType(type)
    },[type])

    return (
        <div className='w-full  h-full border-r-[1px]  border-r-gray-200 dark:border-r-neutral-500'>
            {type === 'Conversation'  ?
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='flex flex-col justify-start items-start h-auto w-[340px]  '>
                        <h1 className='text-[30px] font-bold fonstfamily dark:text-[#ffffffac] text-black tracking-wide'>Select a message</h1>
                        <p className='text-[14px] dark:text-neutral-500 text-gray-200 mt-2 text-wrap font-semibold tracking-wide'>Choose from your conversations, start a new one, or just keep swimming</p>
                        <button onClick={() => onNewMessageUserSearchOpen()} className='bg-[#2f8bfc] text-[18px] p-6 py-3 rounded-[30px] mt-8 outline-none border-none text-white fontsfamily flex justify-center items-center'>
                            New Message
                        </button>
                    </div>
                </div>
                :
                <div className='w-full h-full'>
                    <ConversationWrapper id={id!} />
                </div>
            }
        </div>
    )
}

export default ConversationsList