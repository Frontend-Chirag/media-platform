"use client";

import { Theme, EmojiStyle, EmojiClickData } from 'emoji-picker-react'
import React, { SetStateAction } from 'react'

import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/themeProvider';
import { usePosts } from '@/libs/usePost';

const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);



const EmojiPickerContainer = () => {

    const { themeMode } = useTheme();
    const {textAreaInput, setTextAreaInput} = usePosts();

    const handleNewEmoji = (emoji: EmojiClickData) => {
        const updatedEmojiTextAreaInput = emoji.emoji;
        setTextAreaInput(textAreaInput + updatedEmojiTextAreaInput)
    }

    return (
        <div className='w-[340px] h-[400px] rounded-[20px] absolute bottom-[-420px] left-0 dark:shadow-[0_0_7px_rgba(255,255,255,1)] shadow-[0_0_7px_rgba(0,0,0,0.2)] '>
            <div className='w-full h-full z-[5]  absolute rounded-[20px]'>
                <Picker
                    width='100%'
                    height='100%'
                    theme={themeMode === 'dark' ? Theme.DARK : Theme.LIGHT}
                    emojiStyle={EmojiStyle.TWITTER}
                    skinTonesDisabled={true}
                    className='EmojiPickerReact '
                    style={{ borderRadius: '20px', border: 'none' }}
                    onEmojiClick={(emoji: EmojiClickData) => handleNewEmoji(emoji)}
                />;
            </div>
            <div className='absolute w-[20px] h-[20px] bottom-[15px] rotate-[45deg] -right-[6px] dark:bg-black bg-white z-[2] 
            dark:shadow-[0_0_7px_rgba(255,255,255,1)] shadow-[0_0_7px_rgba(0,0,0,0.2)] ' />
        </div>
    )
}

export default EmojiPickerContainer