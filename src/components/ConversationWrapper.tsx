"use client";

import { IUseConversationUserList } from "./ConversationsUser";
import React, { useEffect, useState } from 'react';
import { getConverationByID } from "@/queries/quriesAndmutations";
import { useUser } from "@/libs/useUser";
import Image from 'next/image';
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlineEmojiEmotions, MdOutlineGifBox } from 'react-icons/md';
import { useGIF } from '@/libs/useGIFModel';
import { GoFileMedia } from 'react-icons/go'
import EmojiPickerContainer from "./EmojiPickerContainer";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import MessageBody from "./MessageBody";


const ConversationWrapper = ({ id }: { id: string }) => {

    const [conversation, setConversation] = useState<IUseConversationUserList>();
    const [showEmoji, setShowEmoji] = useState(false);
    const { onGIFOpen } = useGIF();
    const { data: res, isPending } = getConverationByID(id);
    const [sendMessage, setSendMessage] = useState('');
    const [sending, setSending] = useState(false);
    const { user } = useUser();


    useEffect(() => {
        if (res?.data) {
            setConversation(res?.data)
        }

    }, [res?.data]);

 
    const conversationPartner = conversation?.users.find((partner) => partner._id !== user?._id);

    const handleMessages = async () => {
        try {
            setSending(true)
            await axios.post('/api/users/messages', {
                currentUser: user?._id,
                conversationId: id,
                image: '',
                message: sendMessage,
            });
            setSendMessage('')
            setSending(false)
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div className='w-full h-full text-white'>
            <div className="w-full h-full">
                <div className='w-full h-[60px] flex justify-between items-center px-4'>
                    <div className='w-auto h-full flex justify-center items-center'>
                        <div className='w-[40px] h-[40px] relative overflow-hidden rounded-full '>
                            <Image
                                src={conversationPartner?.profilePicture ? conversationPartner.profilePicture : '/profile-circle.svg'}
                                fill
                                alt="image"
                                className="object-cover"
                            />
                        </div>
                        <h1 className='dark:text-white text-black fontsfamily font-semibold text-[18px] ml-4'>{conversationPartner?.name}</h1>
                    </div>
                    <CiCircleInfo size={25} color="#2f8bfc" />
                </div>
                <div className="w-full h-[calc(100%-140px)] overflow-hidden overflow-y-auto custom-scrollbar">
                  <MessageBody id={id}/>
                </div>
                <div className="w-full h-[80px] border-t-[1px] px-4 py-3 dark:border-t-neutral-500 border-gray-400">
                    <div className="w-full h-full flex justify-start gap-3 items-center bg-[#2f8bfc5b] dark:bg-[#060a10] rounded-2xl px-2 ">
                        <div className='flex justify-start items-center  text-lg text-[#2f8bfc] relative'>
                            {showEmoji &&
                                <EmojiPickerContainer
                                />
                            }
                            <div
                                onClick={() => { }}
                                className='relative postTools rounded-full p-2 hover:bg-[#2f8bfc3c] '>
                                <GoFileMedia className='cursor-pointer ' />
                                <span className='postToolsText flex justify-center items-center absolute md:bottom-[-25px] top-[-25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                                    Media
                                </span>
                            </div>
                            <span
                                className='relative postTools rounded-full p-2 hover:bg-[#2f8bfc3c]  '
                                onClick={() => setShowEmoji(!showEmoji)}
                            >
                                <MdOutlineEmojiEmotions className='cursor-pointer' />
                                <span className='postToolsText flex justify-center items-center absolute md:bottom-[-25px] top-[-25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                                    Emoji
                                </span>
                            </span>
                            <span
                                onClick={() => onGIFOpen()}
                                className='relative postTools rounded-full p-2 hover:bg-[#2f8bfc3c] '>
                                <MdOutlineGifBox className='cursor-pointer' />
                                <span className='postToolsText flex justify-center items-center absolute md:bottom-[-25px] top-[-25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                                    GIF
                                </span>
                            </span>
                        </div>
                        <input
                            onChange={(e) => setSendMessage(e.target.value)}
                            type='text'
                            value={sendMessage}
                            className="w-full h-full fontsfamily dark:text-white text-[18px] text-white text-bold outline-none border-none bg-[#2f8bfc5b] dark:bg-[#060a10]"
                            placeholder="Start a new message"
                        />
                        <IoMdSend onClick={() => { sendMessage !== '' && handleMessages() }} size={25} color={`${sendMessage !== '' ? '#2f8bfc' : '#2f8bfc8e'}`} className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    )
};


export default ConversationWrapper;