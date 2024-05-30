"use client";

import Post, { IUseNewMedia } from '@/components/Post';
import PostSettings from '@/components/PostSettings'
import { IPostDataProps } from '@/components/PostsTab'
import { postTiming } from '@/constant';
import Image from 'next/image'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';
import PostsTools from './PostsTools';

import { usePosts } from '@/libs/usePost';
import { useUser } from '@/libs/useUser';
import { usePostCard } from '@/libs/usePostCard';
import ViewCardtools from './ViewCardtools';
import Comments from './Comments';
import PostAudioContent from './PostAudioContent';
import Link from 'next/link';


export interface viewPostCardProps {
    postsData: IPostDataProps,
    viewPostCardType: 'statusCard' | 'bookmarks' | 'socialContent' | 'PostCard' | 'Comment'
    setPostId?: React.Dispatch<SetStateAction<string>>
}

const ViewPostCard: React.FC<viewPostCardProps> = ({ postsData, viewPostCardType, setPostId }) => {

    const { user } = useUser();
    const { setPostData, onPostCardOpen } = usePostCard();
    const [showSettings, setShowSettings] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { setShowTools } = usePosts();


    useEffect(() => {
        setShowTools(false)
    }, [])


    const handlePostCard = () => {
        setPostData(postsData!);
        // window.history.pushState({}, '', `/profile/${id}/post/${index}`)
        onPostCardOpen();
    };

    const onPlay = () => {
        if (videoRef.current) {
            setIsPlaying(true);
            videoRef.current.play()

        }
    };

    const onPause = () => {
        if (videoRef.current) {
            setIsPlaying(false);
            videoRef.current.pause()
        }

    };


    return (
        <div className=' w-full h-auto flex flex-col overflow-hidden '>
            <div className='w-full h-auto flex px-2 py-6'>
                <div className='w-auto px-2 h-auto flex flex-col  items-center '>
                    <div className='w-[40px] h-[40px]  relative rounded-full overflow-hidden'>
                        <Image
                            src={postsData?.userData?.profilePicture ? postsData?.userData?.profilePicture : '/profile-circle.svg'}
                            fill
                            alt='profile image'
                            className='object-cover'
                        />
                    </div>
                    {viewPostCardType === 'Comment' &&
                        <div className='relative mt-2 w-0.5 grow rounded-full bg-[#2f8bfc]' />
                    }
                </div>
                <div className='w-full  h-auto flex flex-col gap-3 '>
                    <div className='w-full h-auto relative flex flex-col gap-1'>
                        <div className='w-full h-auto flex justify-between items-start'>
                            <Link href={`/profile/${postsData?.userData?._id}`} className='flex gap-2 items-center fontsfamily'>
                                <p className='dark:text-white text-black font-bold text-[18px]'>{postsData?.userData?.name}</p>
                                <p className='text-gray-400 dark:text-neutral-400 text-[15px]'>@{postsData?.userData?.username} . {postTiming(postsData?.createdAt!)} </p>
                            </Link>
                        </div>
                        <div className='w-full h-auto flex flex-col justify-start items-start '>
                            <Link href={`/status/${postsData?._id}`} className='text-[15px] leading-[20px] font-normal break-words dark:text-white text-black fontsfamliy'>{postsData?.caption}</Link>
                            <div className='w-full h-auto flex justify-between items-center '>
                                <PostAudioContent
                                    AudioContentType='ShowAudio'
                                    audio={postsData?.audio}
                                />
                            </div>
                        </div>
                        {(user?._id === postsData?.userData?._id!) &&
                            <>
                                <span onClick={() => setShowSettings(!showSettings)} className=' comment absolute top-0 right-0  rounded-full p-2 cursor-pointer'>
                                    <BsThreeDots className='dark:text-white text-black text-lg ' />
                                </span>
                                <PostSettings
                                    userId={postsData?.userData?._id!}
                                    showSettings={showSettings}
                                    settingsType='StatusCard'
                                    isPinned={postsData?.isPinned!}
                                    postId={postsData?._id!}
                                />
                            </>
                        }
                    </div>

                    {postsData?.media?.length !== 0 &&
                        <div className='w-full h-auto'>
                            <div className="media-grid">
                                {postsData?.media?.map((file: IUseNewMedia, index) => (
                                    <div
                                        key={index}
                                        className={`media-item ${postsData?.media?.length === 3 && index === 0 ? 'span-2' : ''}`}
                                    >
                                        {file?.mediaType === 'image' ? (
                                            <Image
                                                onClick={handlePostCard}
                                                src={file?.url as string}
                                                fill
                                                alt='image'
                                                className='object-cover cursor-pointer'
                                            />
                                        ) : (
                                            <div className='w-full h-full relative overflow-hidden'>
                                                <video ref={videoRef} className='absolute object-cover w-full h-full' src={file?.url as string} loop />
                                                <div onClick={() => !isPlaying ? onPlay() : onPause()} className='w-full h-full cursor-pointer absolute z-[7] top-0 left-0' />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewPostCard