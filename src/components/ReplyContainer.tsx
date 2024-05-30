"use client";

import PostBottomNav from '@/UIModels/PostBottomNav';
import PostContent from '@/UIModels/PostContent';
import { handleImages } from '@/constant';
import { usePosts } from '@/libs/usePost';
import { useReply } from '@/libs/useReply';
import { usePostComment } from '@/queries/quriesAndmutations';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { IUseCommentNewMedia } from './Post';
import { useUser } from '@/libs/useUser';
import toast from 'react-hot-toast';
import { useLoader } from '@/libs/useLoader';


const ReplyContainer = () => {

    const { setIsLoader } = useLoader()

    const { isReply, onReplyClose, replyToData, postReplyId,
        setShowTools,
        textAreaInput,
        setTextAreaInput,
        textAreaInputLength,
        setTextAreaInputLength, postData, replyMedia, setPostReplyId, setPostData, setReplyMedia, setCurrentIndex, currentIndex, parentPostIds } = useReply();

    const { mutateAsync: postComment } = usePostComment(postReplyId!);
    const { user } = useUser();

    const handleBack = () => {
        setReplyMedia([]);
        setTextAreaInput('');
        setTextAreaInputLength(0)
        setReplyMedia([]);
        setPostReplyId('');
        setPostData({
            caption: '',
            profilePicture: '',
            name: '',
            username: ''
        })
        onReplyClose();
    }

    const handlePostComments = async () => {
        onReplyClose();

        const newCaption = textAreaInput;
        const newCommentsMedia: IUseCommentNewMedia[] = replyMedia.map(({ tags, ...rest }) => rest);
        const newCommentPostId = postReplyId;
        try {
            setIsLoader(true);
            setTextAreaInput('');
            setTextAreaInputLength(0)
            setReplyMedia([]);
            setPostReplyId('');
            setPostData({
                caption: '',
                profilePicture: '',
                name: '',
                username: ''
            })

            await postComment({
                postId: newCommentPostId,
                userId: user?._id!,
                caption: newCaption,
                media: newCommentsMedia,
                parentPosts: Array.isArray(parentPostIds) ? parentPostIds : [parentPostIds]
            });

            setIsLoader(false)

        } catch (error) {
            console.log(error);
            toast.error('Failed to Post Comment, Try again')
        }
    }

    return (
        <div className={`absolute top-0 left-0 bg-[#2f8bfc3c] w-full  h-full z-[999] ${isReply ? 'flex' : 'hidden'} justify-center items-center `}>
            <div className='w-full h-full md:w-[563px] md:h-auto gap-1 relative px-4 py-2 bg-white dark:bg-black md:rounded-[15px] flex flex-col '>
                <div className='flex justify-between items-center h-[40px] mb-6 '>
                    <div className='flex justify-start items-end gap-5 '>
                        <FaArrowLeft
                            onClick={handleBack}
                            className='text-[#2f8bfc] cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                        w-[35px] h-[35px] p-2
                        '
                        />
                        <h1 className=' text-[#2f8bfc] text-2xl font-bold'>Post Reply</h1>
                    </div>

                </div>
                <div className='flex'>
                    <div className='flex w-[45px] flex-col items-center'>
                        <div className='w-[35px] h-[35px] relative overflow-hidden rounded-full ml-1'>
                            <Image
                                src={postData?.profilePicture ? postData.profilePicture : '/profile-circle.svg'}
                                alt='profile'
                                fill
                                className='object-cover'
                            />
                        </div>
                        <div className='relative mt-2 w-0.5 grow rounded-full bg-[#2f8bfc]' />
                    </div>
                    <div className='w-[calc(100%-50px)] h-full ml-6'>
                        <div className='w-full h-full flex flex-col justify-start  gap-2'>
                            <div className='flex gap-2 items-start justify-start fontsfamily'>
                                <p className='dark:text-white text-black font-bold text-[18px]'>{postData?.name}</p>
                                <p className='text-gray-400 dark:text-neutral-400 text-[15px]'>@{postData?.username}  </p>
                            </div>
                            <p className='text-[15px] leading-[20px] font-normal break-words dark:text-white text-black fontsfamliy'>{postData?.caption}</p>

                            {Array.isArray(replyToData) ?
                                <h1 className='text-gray-400 dark:text-neutral-400  text-md mb-2 gap-2'  >
                                    Replying  to
                                    {replyToData?.map((data, index) => (
                                        <Link key={index} href={`/profile/${data?.userId}`} className='text-[#2f8bfc] fontsfamily text-lg'> @{data?.username} {!(replyToData.length - 1) && 'and'}</Link>
                                    ))}
                                </h1>
                                : (
                                    <h1 className='text-gray-400 dark:text-neutral-400  text-md mb-2'  >
                                        Replying  to
                                        <Link href={`/profile/${replyToData?.userId}`} className='text-[#2f8bfc] fontsfamily text-lg'> @{replyToData?.username}</Link>
                                    </h1>
                                )
                            }

                        </div>

                    </div>
                </div>
                <div className={`w-full h-auto max-h-[400px]  flex flex-col  text-start relative`}>
                    <div className={`w-full h-full  overflow-hidden flex justify-start items-start  `}>
                        <PostContent
                            PostType={'PostComment'}
                            profilePicture={postData?.profilePicture!}
                            media={replyMedia}
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            setMedia={setReplyMedia}
                            textAreaInput={textAreaInput}
                            setTextAreaInput={setTextAreaInput}
                            setTextAreaInputLength={setTextAreaInputLength}
                            setShowTools={setShowTools}
                        />
                    </div>
                    <div className='w-full h-auto  '>
                        <PostBottomNav
                            media={replyMedia}
                            PostType={'PostComment'}
                            textAreaInput={textAreaInput}
                            textAreaInputLength={textAreaInputLength}
                            handlePostUpload={handlePostComments}
                            handleImages={(e) => handleImages({ e, media: replyMedia, setCurrentIndex, setMedia: setReplyMedia })}
                        />
                    </div>

                </div>
            </div>
        </div >
    )
}

export default ReplyContainer