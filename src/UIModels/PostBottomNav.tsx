"use client";

import EmojiPickerContainer from '@/components/EmojiPickerContainer';
import { ImageType } from '@/components/ModelProvider';
import { useTheme } from '@/contexts/themeProvider';
import { useAudioModel } from '@/libs/useAudioModel';
import { useGIF } from '@/libs/useGIFModel';
import { usePosts } from '@/libs/usePost';
import React, { Ref, useRef, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { GoFileMedia } from 'react-icons/go'
import { MdOutlineAudiotrack, MdOutlineEmojiEmotions, MdOutlineGifBox } from 'react-icons/md'

interface IUsePostBottomNav {
    media: ImageType[];
    PostType: string;
    handlePostUpload: () => void;
    handleImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textAreaInput: string,
    textAreaInputLength: number
}

const PostBottomNav: React.FC<IUsePostBottomNav> = ({
    PostType,
    media,
    handlePostUpload,
    handleImages,
    textAreaInput,
    textAreaInputLength
}) => {

    const { themeMode } = useTheme();
    const { onGIFOpen } = useGIF();
    const { onAudioModelOpen } = useAudioModel();
    const [showEmoji, setShowEmoji] = useState(false);
    const imageSelectRef = useRef<HTMLInputElement | null>(null);


    return (
        <div className={`w-full h-[50px] p-2 flex ${PostType !== 'PostComment' && 'border-t-[1px] relative border-gray-300 dark:border-neutral-600'}  `}>
            {/* starting --- PostTools */}
            <input
                type='file'
                className='hidden'
                ref={imageSelectRef}
                onChange={(e) => handleImages(e)}
            />
            <div className={`w-full h-full flex relative items-center  justify-between  ${PostType !== 'PostComment' && 'border-r-[1px] px-2 border-gray-300 dark:border-neutral-600'}   `}>
                <div className='flex justify-start items-center  text-lg text-[#2f8bfc] '>
                    <div
                        onClick={() => imageSelectRef.current?.click()}
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
                    {PostType === 'CreatePost' &&
                        <span
                            onClick={() => onAudioModelOpen()}
                            className='relative postTools rounded-full p-2 hover:bg-[#2f8bfc3c] '>

                            <MdOutlineAudiotrack className='cursor-pointer' />

                            <span className='postToolsText flex justify-center items-center absolute md:bottom-[-25px] top-[-25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                                Songs
                            </span>
                        </span>
                    }
                </div>


                <span className='flex justify-center items-center h-full w-[50px]  gap-2 '>
                    {textAreaInputLength < 20 &&
                        <p className={`${textAreaInputLength < 0 ? 'text-[#ec0c0c]' : 'text-[#f5f842]'} text-sm `}>{textAreaInputLength}</p>
                    }
                    {!(textAreaInputLength < 0) &&
                        <CircularProgressbar
                            value={256 - textAreaInputLength}
                            minValue={0}
                            maxValue={256}
                            styles={buildStyles({
                                pathColor: `${textAreaInputLength < 20 ? '#f5f842' : (textAreaInputLength < 20 ? '#ec0c0c' : '#2f8bfc')}`,
                                trailColor: `${themeMode === 'dark' ? '#2c2b2b' : '#ccc9c9'}`

                            })}
                            className={`${textAreaInputLength < 20 ? 'w-[30px] h-[30px]' : 'w-[20px] h-[20px]'} transition-all`}
                        />
                    }
                </span>

            </div>
            {/* ending --- PostTools */}

            {/* staring --- postButton */}
            <div className='w-[100px] h-full flex justify-end items-center '>
                <button
                    onClick={handlePostUpload}
                    disabled={((media.length > 0) || (textAreaInput !== '')) ? false : true}
                    className='bg-[#2f8bfc] text-white disabled:opacity-[0.5] py-2 px-4 rounded-[90px] font-bold text-md border-none outline-none'>

                    {PostType === 'CreatePost' ? 'Post' : 'reply'}
                </button>
            </div>
            {/* ending --- postButton */}
            {showEmoji &&
                <EmojiPickerContainer
                />
            }
        </div>
    )
}

export default PostBottomNav