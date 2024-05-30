"use client";

import PostSettings from '@/components/PostSettings'
import Image from 'next/image'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'

import { usePosts } from '@/libs/usePost';
import { useUser } from '@/libs/useUser';
import { usePostCard } from '@/libs/usePostCard';
import PostsTools from './PostsTools';
import { IUseReplyToData, useReply } from '@/libs/useReply';
import Link from 'next/link';


export interface IUseCommentMedia {
    url: string;
    mediaType: 'image' | 'video' | 'gif';
}

export interface ICommentDataProps {
    _id: string,
    caption: string,
    comments: [],
    likes: [],
    savePosts: [],
    reposts: [],
    media: IUseCommentMedia[],
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    commentData?: ICommentDataProps[]
    userData: {
        name: string
        username: string
        profilePicture: string
        _id: string
    }
}

export interface viewPostCardProps {
    commentData: ICommentDataProps,
    setPostId?: React.Dispatch<SetStateAction<string>>;
    parentPostUserData: {
        username: string,
        userId: string
    }
    commentType: 'StatusCard' | 'PostCard';
    parentPostIds: string[]
}

const CommentCard: React.FC<viewPostCardProps> = ({ commentData, setPostId, parentPostUserData, parentPostIds, commentType }) => {

    const { user } = useUser();

    const [showSettings, setShowSettings] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { setShowTools } = usePosts();



    useEffect(() => {
        setShowTools(false)
    }, []);

    const timeAgo = (timestamp: string | number | Date): string => {
        const currentDate = new Date();
        const previousDate = new Date(timestamp);

        const seconds = Math.floor((currentDate.getTime() - previousDate.getTime()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    };

    const handleComment = () => {

    }

    // const handlePostCard = () => {
    //     setPostData(commentData!);
    //     // window.history.pushState({}, '', `/profile/${id}/post/${index}`)
    //     onPostCardOpen();
    // };

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

    // const calculateElapsedTime = (createdAt: Date) => {
    //     const now = new Date();
    //     const difference = now.getTime() - createdAt.getTime();

    //     const hr = Math.floor(difference / (1000 * 60 * 60 ));
    //     if(hr > 0){
    //         return `${hr}hr`;
    //     }
    //     const min = Math.floor(difference % (1000 * 60 * 60 )) / (1000 * 60);
    //     if(min > 0){
    //         return `${min}m`
    //     }
    //     const sec = Math.floor(difference % (1000 * 60)) / 1000;
    //     return `${sec}sec`
    // }

    return (
        <div className=' w-full h-auto flex flex-col overflow-hidden '>
            <div className='w-full h-auto flex '>
                <div className='w-auto px-1 h-auto flex justify-end items-start '>
                    <div className='w-[40px] h-[40px]  relative rounded-full overflow-hidden'>
                        <Image
                            src={commentData?.userData?.profilePicture ? commentData?.userData?.profilePicture : '/profile-circle.svg'}
                            fill
                            alt='profile image'
                            className='object-cover'
                        />
                    </div>
                </div>
                <div className='w-full  h-auto flex flex-col gap-3 '>
                    <div className='w-full h-auto relative flex items-center justify-between '>
                        <div className='w-full h-auto flex justify-between items-start'>
                            <Link href={`/profile/${commentData?.userData?._id}`} className='flex gap-1 fontsfamily items-center'>
                                <p className='dark:text-white text-black font-bold text-[16px]'>{commentData?.userData?.name}</p>
                                <div className='text-gray-400 flex dark:text-neutral-400 text-[14px]'>
                                    <p className='truncate'>
                                        @{commentData?.userData?.username}.
                                    </p>

                                    <p>
                                        {timeAgo(commentData?.createdAt)}
                                    </p>
                                </div>
                            </Link>

                        </div>

                        {(user?._id === commentData?.userData?._id!) &&
                            <>
                                <span onClick={() => setShowSettings(!showSettings)} className=' comment  top-0 right-0  rounded-full p-2 cursor-pointer'>
                                    <BsThreeDots className='dark:text-white text-black text-lg ' />
                                </span>
                                <PostSettings
                                    userId={commentData?.userData?._id!}
                                    showSettings={showSettings}
                                    settingsType='StatusCard'
                                    isPinned={false}
                                    postId={commentData?._id!}
                                />
                            </>
                        }
                    </div>
                    <Link href={`/status/${commentData?._id}`} className='w-full h-auto flex flex-col justify-start items-start '>
                        <p className='text-[15px] leading-[20px] font-normal break-words dark:text-white text-black fontsfamliy'>{commentData?.caption}</p>
                    </Link>

                    {commentData?.media?.length !== 0 &&
                        <div style={{ width: '100%', height: `${commentType === 'PostCard' ? '230px' : '500px'}` }} >
                            <div
                                style={{
                                    display: 'grid',
                                    gap: '3px',
                                    gridTemplateColumns: `${commentData?.media?.length > 1 ? '1fr 1fr ' : '1fr'}`,
                                    gridTemplateRows: `${commentData?.media?.length > 2 ? '1fr 1fr' : '1fr'}`,
                                }}
                                className="grid w-full h-full rounded-[20px] overflow-hidden "
                            >

                                {commentData?.media?.map((file: IUseCommentMedia, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            gridRow: `${commentData?.media?.length === 3 && index === 0 ? 'span 2' : 'auto'}`,
                                        }}
                                        className=' relative w-full h-full overflow-hidden'
                                    >
                                        {file?.mediaType === 'image'
                                            ? <Image
                                                // onClick={handlePostCard}
                                                src={file?.url}
                                                fill
                                                alt='image'
                                                className='object-cover'
                                            />
                                            :
                                            <div className='w-full h-full relative  overflow-hidden'>
                                                <video ref={videoRef} className='absolute object-cover w-full h-full' style={{ objectFit: 'cover', position: 'absolute' }} src={file?.url} loop></video>
                                                <div onClick={() => !isPlaying ? onPlay() : onPause()} className='w-full h-full cursor-pointer absolute z-[7]  top-0 left-0  ' />

                                            </div>

                                        }
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

export default CommentCard