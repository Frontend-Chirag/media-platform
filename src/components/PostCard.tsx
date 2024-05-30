"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';


import PostSettings from './PostSettings';
import PostsTools from '@/UIModels/PostsTools';
import { usePostCard } from '@/libs/usePostCard';
import { useUser } from '@/libs/useUser';
import { handleImages, postTiming } from '@/constant';
import { usePostComment } from '@/queries/quriesAndmutations';
import PostAudioContent from '@/UIModels/PostAudioContent';
import PostBottomNav from '@/UIModels/PostBottomNav';
import PostContent from '@/UIModels/PostContent';
import Comments from '@/UIModels/Comments';
import { IUseCommentNewMedia } from './Post';
import toast from 'react-hot-toast';
import { useLoader } from '@/libs/useLoader';

const PostCard = () => {

    const { user } = useUser()
    const { isPostCard, postData, onPostCardClose, setPostData, postCardPostMedia, setPostCardPostMedia, currentIndex, setCurrentIndex, textAreaInput, setTextAreaInput, textAreaInputLength, setTextAreaInputLength, setShowTools } = usePostCard();
    const { setIsLoader } = useLoader();
    const { mutateAsync: uploadComment } = usePostComment(postData?._id!);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [replyTools, setReplyTools] = useState(false);

    const imagesSliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isPostCard) {
            setReplyTools(false)
        }
    }, [isPostCard])

    useEffect(() => {
        const newPosition = -currentImageIndex * (380);
        if (imagesSliderRef.current) {
            imagesSliderRef.current.style.left = `${newPosition}px`;
        }

    }, [currentImageIndex]);


    const handlePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1)
        }
    };

    const handleNext = () => {
        if (currentImageIndex < postData?.media.length! - 1) {
            setCurrentImageIndex(currentImageIndex + 1)
        }
    };

    const handleLinkPostCard = () => {
        setPostData(postData!);
    };

    const handlePostComments = async () => {

        const newCommentsMedia: IUseCommentNewMedia[] = postCardPostMedia.map(({ tags, ...rest }) => rest)
        const newCaption = textAreaInput;

        try {

            setPostCardPostMedia([]);
            setTextAreaInput('');
            setTextAreaInputLength(0);

            setIsLoader(true);
            await uploadComment({
                postId: postData?._id!,
                userId: user?._id!,
                caption: newCaption,
                media: newCommentsMedia,
                parentPosts: [postData?._id!]
            });
            setIsLoader(false)

        } catch (error) {
            console.log(error);
            toast.error('failed to Post Comment, Try again')
        }
    }


    return (
        <div className={`${isPostCard ? 'flex' : 'hidden'} justify-center items-center select-none  w-full h-full z-[100] absolute top-0 left-0 overflow-hidden `}>
            <div className='md:w-[calc(100%-26%)] w-full h-full bg-[#ffffffa2] dark:bg-[rgba(0,0,0,0.8)] flex flex-col pt-[10px] px-4'>
                <FaArrowLeft
                    onClick={() => { onPostCardClose(), setPostCardPostMedia([]) }}
                    className='text-[#2f8bfc] absolute left-4 top-2 cursor-pointer text-2xl z-[5]'
                />
                <div className='w-full h-[calc(100%-70px)] flex justify-center items-center  relative'>
                    {
                        currentImageIndex > 0 &&
                        <button
                            onClick={handlePrev}
                            className='absolute left-0 top-[50%] z-[9] dark:text-black text-white rounded-full bg-[#2f8bfc] p-2'>
                            <FaArrowLeft />
                        </button>
                    }
                    {
                        currentImageIndex < postData?.media?.length! - 1 &&
                        <button
                            onClick={handleNext}
                            className='absolute right-0 top-[50%] z-[9] dark:text-black text-white rounded-full bg-[#2f8bfc]  p-2'>
                            <FaArrowRight />
                        </button>
                    }
                    <div className='w-[380px] h-full relative rounded-[10px] overflow-hidden border-[2px] dark:border-neutral-900'>
                        <div ref={imagesSliderRef} className='w-auto h-full flex absolute overflow-x-auto overflow-hidden transition-all'>
                            {postData?.media?.map((image, index) => {
                                const url = image?.url as string;

                                return (
                                    <div key={index} className='w-[380px] h-full '>
                                        {image?.mediaType === 'image'
                                            ? <div className='w-full h-full relative'>
                                                <Image
                                                    src={url}
                                                    fill
                                                    alt='image'
                                                    className='object-cover'
                                                />
                                                {image?.tags?.length > 0 && (
                                                    image?.tags?.map((user) => {
                                                        return (
                                                            <div key={user?.taggedUserId} className='w-auto h-[30px] bg-[#000000ba] px-2 absolute z-[999]  rounded-lg text-white flex justify-center items-center'
                                                                style={{
                                                                    top: `${(user?.positionY)}px`,
                                                                    left: `${(user?.positionX)}px`
                                                                }}
                                                            >
                                                                <span className='absolute rotate-45 w-[15px] h-[15px] bg-gradient-to-br from-[#000000ba] from-50% to-transparent to-50%  top-[-7px]' />
                                                                <p className='text-[12px] '>@{user?.username}</p>
                                                            </div>
                                                        )
                                                    })

                                                )}
                                            </div>
                                            : ((image?.mediaType === 'gif' || image?.mediaType === 'video') &&
                                                <video src={url} loop className='w-full h-full object-cover' />
                                            )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='w-full h-[60px] flex justify-center items-center bg-white dark:bg-black mt-[10px]'>
                    <div className='w-[350px] h-full'>
                        <PostsTools
                            postId={postData?._id!}
                            currentUserLoggedInId={user?._id!}
                            PostToolsType='PostCard'
                            likes={postData?.likes!}
                            saves={postData?.savePosts!}
                            postData={{
                                name: postData?.userData?.name!,
                                username: postData?.userData?.username!,
                                caption: postData?.caption!,
                                profilePicture: postData?.userData?.profilePicture!,
                            }}
                            reposts={postData?.reposts!}
                            comments={postData?.comments!}
                            replyTo={{ userId: postData?.userData._id!, username: postData?.userData.username! }}
                            parentPostIds={[postData?._id!]}
                        />
                    </div>
                </div>
            </div>
            <div className='w-[calc(100%-74%)] md:flex hidden  h-full bg-white  relative dark:bg-black border-l-[1px] border-gray-400 dark:border-neutral-700 overflow-hidden overflow-y-auto flex-col'>
                {user?._id === postData?.userData._id &&
                    <PostSettings
                        userId={postData?.userData._id!}
                        showSettings={showSettings}
                        settingsType='PostCard'
                        postId={postData?._id!}
                        isPinned={postData?.isPinned!}
                        onClick={() => { handleLinkPostCard() }}
                    />
                }
                <div className=' w-full h-auto border-b-[1px] border-gray-400 dark:border-neutral-700 px-2 pt-3'>
                    <div className='w-full h-auto flex flex-col border-b-[1px] dark:border-neutral-700 border-neutral-400  '>
                        <div className='w-full h-auto  flex justify-between items-center'>
                            <Link href={`/profile/${postData?.userData._id}`} className='w-auto h-auto flex justify-start gap-2 items-center  py-1'>
                                <div className='w-[60px] h-[60px] relative rounded-full overflow-hidden '>
                                    <Image
                                        src={postData?.userData.profilePicture ? postData?.userData.profilePicture : '/profile-circle.svg'}
                                        fill
                                        alt='userImage'
                                        className='object-cover'
                                    />
                                </div>
                                <div className='flex flex-col justify-start items-center'>
                                    <p className='dark:text-white text-black fontsfamily text-[17px]'>{postData?.userData.username}</p>
                                    <p className='dark:text-gray-400 text-neutral-500 fontsfamily text-[14px]'>{postData?.userData.name}</p>
                                </div>
                            </Link>
                            {user?._id === postData?.userData._id &&
                                <span onClick={() => setShowSettings(!showSettings)} className=' comment rounded-full p-2 mr-4 cursor-pointer'>
                                    <BsThreeDots className='dark:text-white text-black text-lg ' />
                                </span>
                            }
                        </div>
                        {postData?.caption &&
                            <p className='dark:text-white text-black text-[14px] mt-2 flex-wrap'>{postData?.caption}</p>
                        }
                        <PostAudioContent
                            AudioContentType='ShowAudio'
                            audio={postData?.audio}
                        />
                        <p className='text-gray-400 dark:text-neutral-400 fontsfamily text-lg mb-4'>{postTiming(postData?.createdAt!)}</p>
                    </div>
                    <div className='w-full h-[60px] px-3'>
                        <PostsTools
                            postId={postData?._id!}
                            currentUserLoggedInId={user?._id!}
                            PostToolsType='PostCard'
                            likes={postData?.likes!}
                            saves={postData?.savePosts!}
                            reposts={postData?.reposts!}
                            postData={{
                                name: postData?.userData?.name!,
                                username: postData?.userData?.username!,
                                caption: postData?.caption!,
                                profilePicture: postData?.userData?.profilePicture!,
                            }}
                            comments={postData?.comments!}
                            replyTo={{ userId: postData?.userData._id!, username: postData?.userData.username! }}
                            parentPostIds={[postData?._id!]}
                        />
                    </div>
                    <div className='w-full h-auto max-h-[400px] border-t-[1px] dark:border-neutral-700 border-neutral-400  flex flex-col text-center relative'>
                        {replyTools &&
                            <h1 className='text-gray-400 dark:text-neutral-400  text-md mb-2'  >
                                Replying  to
                                <Link href={`/profile/${postData?.userData?._id}`} className='text-[#2f8bfc] fontsfamily text-lg'> @{postData?.userData?.username}</Link>
                            </h1>
                        }
                        <div onClick={() => setReplyTools(true)} className={`w-full h-full overflow-hidden flex justify-between ${replyTools ? 'items-start' : 'items-center'} `}>
                            <PostContent
                                PostType={'PostComment'}
                                profilePicture={user?.profilePicture!}
                                media={postCardPostMedia}
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                                setMedia={setPostCardPostMedia}
                                textAreaInput={textAreaInput}
                                setTextAreaInput={setTextAreaInput}
                                setTextAreaInputLength={setTextAreaInputLength}
                                setShowTools={setShowTools}
                            />
                            {!replyTools &&
                                <button
                                    disabled={true}
                                    className='bg-[#2f8bfc] text-white disabled:opacity-[0.5] py-2 px-4 rounded-[90px] font-bold text-md border-none outline-none'>
                                    reply
                                </button>
                            }
                        </div>
                        {replyTools &&
                            <div className='w-full h-auto '>
                                <PostBottomNav
                                    media={postCardPostMedia}
                                    PostType={'PostComment'}
                                    handlePostUpload={() => handlePostComments()}
                                    textAreaInput={textAreaInput}
                                    textAreaInputLength={textAreaInputLength}
                                    handleImages={(e) => handleImages({ e, media: postCardPostMedia, setCurrentIndex, setMedia: setPostCardPostMedia })}
                                />
                            </div>
                        }
                    </div>
                    <div className='w-full h-auto'>
                        <Comments
                            postId={postData?._id!}
                            parentPostUserData={{
                                username: postData?.userData.username!,
                                userId: postData?.userData._id!
                            }}
                            commentType='PostCard'
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PostCard