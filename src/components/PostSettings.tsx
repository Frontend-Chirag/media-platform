"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AiFillDelete } from 'react-icons/ai';
import { MdPushPin } from 'react-icons/md';
import { IoChatbox, IoEarth } from 'react-icons/io5';
import { FaUser, FaUserCheck, FaLocationArrow } from 'react-icons/fa';
import { RiUnpinFill } from 'react-icons/ri';

import { usePinAndUnpinByPosts, usePinAndUnpinByPostsById, usedeletPost } from '@/queries/quriesAndmutations';
import { useLoading } from '@/libs/useLoading';
import { usePostCard } from '@/libs/usePostCard';


interface PostSettingsProps {
    showSettings: boolean;
    userId: string;
    postId: string;
    settingsType: 'PostCard' | 'ContentCard' | 'StatusCard'
    onClick?: () => void;
    isPinned: boolean;
}

const PostSettings: React.FC<PostSettingsProps> = ({ showSettings, isPinned, userId, postId, settingsType, onClick }) => {

    const [showMoreSettings, setShowMoreSettings] = useState(false);
    const { mutateAsync: deletePost, isPending: isDeleting } = usedeletPost();
    const { onPostCardClose } = usePostCard();
    const { loading, IsSetLoading, onSetLoading } = useLoading();
    const { mutateAsync: isPinPost } = usePinAndUnpinByPosts({ currentPostId: postId, userId: userId });
    const { mutateAsync: isPinPostById } = usePinAndUnpinByPostsById();


    useEffect(() => {
        if (!showSettings) {
            setShowMoreSettings(false);
        }
    }, [showSettings]);

    const handleTransferData = () => {
        if (onClick) {
            onClick()
            onPostCardClose()
        }
    };

    const handleDeletePost = async () => {
        try {
            IsSetLoading();

            await deletePost({
                postId: postId,
                userId: userId
            })

            onSetLoading();

            if (settingsType === 'PostCard') {
                onPostCardClose();
            }
        } catch (error: any) {
            console.log(error)
        }
    };

    const handlePin = async () => {
        if (isPinned) {
            if (settingsType === 'PostCard') {
                await isPinPost({
                    postId: postId,
                    isPinned: false,
                    userId: userId
                })
            } else if (settingsType === 'StatusCard') {
                await isPinPostById({
                    postId: postId,
                    isPinned: false,
                    userId: userId
                })

            }
            // await axios.patch('/api/users/pinandunpin', { postId: postId, isPinned: false, })
            toast('Your Post has been unPinned', {
                icon: <RiUnpinFill />,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })
        } else {
            if (settingsType === 'PostCard') {
                await isPinPost({
                    postId: postId,
                    isPinned: true,
                    userId: userId
                })
            } else if (settingsType === 'StatusCard') {
                await isPinPostById({
                    postId: postId,
                    isPinned: true,
                    userId: userId
                })
            }
            // await axios.patch('/api/users/pinandunpin', { postId: postId, isPinned: true, });
            toast('Your Post has been Pinned', {
                icon: <MdPushPin />,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })

        }
    }

    return (
        <div className={`${showSettings ? 'flex' : 'hidden'} flex-col text-black transition-all dark:text-white overflow-hidden absolute right-5 top-[80px]  z-[999]   w-[300px] h-auto dark:bg-black bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.8)] shadow-[0_0_8px_rgba(0,0,0,0.8)] rounded-lg `}>
            <div onClick={handleDeletePost} className='w-full bg-tranparent h-[40px] flex items-center cursor-pointer justify-start gap-5 text-red-500 text-lg  px-4  fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                <AiFillDelete />
                <p>Delete Post</p>
            </div>
            {settingsType !== 'StatusCard' &&
                <Link href={`/status/${postId}`} onClick={handleTransferData} className='w-full bg-tranparent h-[40px] flex items-center  cursor-pointer justify-start gap-5  px-4 text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                    <FaLocationArrow />
                    <p>View Post</p>
                </Link>
            }
            <div onClick={handlePin} className='w-full bg-tranparent h-[40px] flex items-center  cursor-pointer justify-start gap-5  px-4  text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                {!isPinned
                    ? <MdPushPin />
                    : <RiUnpinFill />
                }
                <p>{!isPinned ? 'Pin' : 'Unpin'} to your profile</p>
            </div>

            <div onClick={() => { setShowMoreSettings(!showMoreSettings) }} className='w-full bg-tranparent h-[40px] flex items-center  cursor-pointer justify-start gap-5  px-4 text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                <IoChatbox />
                <p>Change who can reply</p>
            </div>
            <div className={`w-full bg-tranparent ${!showMoreSettings ? 'h-0' : 'h-auto py-2'} flex overflow-hidden transition-all flex-col  text-start text-black dark:text-white text-lg fontsfamliy`}>
                <p className='ml-4 leading text-[16px]'>Who can reply?</p>
                <p className='ml-4 dark:text-neutral-500 text-gray-400 '>Choose who can reply to this post Anyone mentioned can always reply.</p>
                <div className='w-full bg-tranparent h-[40px] flex items-center cursor-pointer justify-start mt-4 gap-5 px-4 text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                    <span className='flex justify-center items-center p-2 bg-[#2f8bfc] text-white rounded-full'>
                        <IoEarth />
                    </span>
                    <p>EveryOne</p>
                </div>
                <div className='w-full bg-tranparent h-[40px] flex items-center  cursor-pointer justify-start gap-5  px-4  text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                    <span className='flex justify-center items-center p-2 bg-[#2f8bfc] text-white rounded-full'>
                        <FaUserCheck />
                    </span>
                    <p>Account you follow</p>
                </div>
                <div className='w-full bg-tranparent h-[40px] flex items-center  cursor-pointer justify-start gap-5  px-4  text-black dark:text-white text-lg fontsfamliy hover:dark:bg-neutral-900 hover:bg-gray-100'>
                    <span className='flex justify-center items-center p-2 bg-[#2f8bfc] text-white rounded-full'>
                        <FaUser />
                    </span>
                    <p>Only you</p>
                </div>
            </div>
        </div>
    )
};

export default PostSettings;