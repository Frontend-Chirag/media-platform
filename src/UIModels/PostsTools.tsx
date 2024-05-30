"use client"

import React, { SetStateAction, useEffect, useState } from 'react';
import { BiRepost } from 'react-icons/bi';
import { FaRegComment } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { GoHeart, GoHeartFill } from 'react-icons/go';


import { usePostCard } from '@/libs/usePostCard';
import { usePostTools } from '@/libs/usePostTools';
import { useLikeDislikePost, useRepostsAndUnrepost, useSaveAndUnsavePost } from '@/queries/quriesAndmutations';
import { BsSave, BsSaveFill } from 'react-icons/bs';
import { useUser } from '@/libs/useUser';
import { useReply } from '@/libs/useReply';
import { IUseReplyToData } from '@/libs/useReply';
import toast from 'react-hot-toast';


interface LikeModelProps {
    postId: string;
    currentUserLoggedInId: string;
    PostToolsType: 'statusCard' | 'bookmarks' | 'socialContent' | 'PostCard' | 'Comment';
    likes: [];
    saves: [];
    reposts: [];
    comments: [],
    postData: {
        name: string,
        username: string,
        caption: string,
        profilePicture: string,
    }
    setCommentPostId?: React.Dispatch<SetStateAction<{ likesId: string; savePostId: string; commentsLength: string; }>>;
    replyTo: IUseReplyToData | IUseReplyToData[],
    parentPostIds: string[];
}

const PostsTools: React.FC<LikeModelProps> = ({ postId, comments, setCommentPostId, parentPostIds, postData, replyTo, currentUserLoggedInId, reposts, PostToolsType, likes, saves }) => {

    const { user } = useUser();
    const { setNewPostId } = usePostTools()
    const { onReplyOpen, setPostReplyId, setReplyToData, setPostData, setParentPostIds } = useReply();

    const [like, setLike] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isRepost, setIsRepost] = useState(false);
    const [scale, setScale] = useState(1);

    const { mutateAsync: isLikedorDisliked } = useLikeDislikePost();
    const { mutateAsync: isSavedorUnsaved } = useSaveAndUnsavePost();
    const { mutateAsync: isRepostorUnRepost } = useRepostsAndUnrepost(user?._id!);

    useEffect(() => {
        const isReposted = reposts?.find((repostId) => repostId === currentUserLoggedInId);
        setIsRepost(isReposted!);
    }, [reposts])

    useEffect(() => {
        if (likes) {
            const isLiked = likes.find((likedId) => likedId === currentUserLoggedInId);
            setLike(isLiked!)
        }
    }, [likes]);

    useEffect(() => {
        if (saves) {
            const isSaved = saves.find((savedId) => savedId === currentUserLoggedInId);
            setIsSave(isSaved!)
        }
    }, [saves]);


    const handleLikeAndUnlikePost = async () => {
        try {

            if (PostToolsType === 'Comment' && setCommentPostId) {
                setCommentPostId((prev) => ({
                    ...prev,
                    likesId: postId
                }))

                setNewPostId((prev) => ({
                    ...prev,
                    likes: ''
                }))
            } else {
                setNewPostId((prev) => ({
                    ...prev,
                    likes: postId
                }))
            }

            if (!like) {
                isLikedorDisliked({
                    postId: postId,
                    currentUserLoggedInId: currentUserLoggedInId,
                    isLike: like
                });
                setScale(1.2);
                setTimeout(() => {
                    const audio = document.createElement('audio');
                    audio.src = '/pop.mp3';
                    audio.play()
                    setScale(1);
                }, 400);
            } else {
                isLikedorDisliked({
                    postId: postId,
                    currentUserLoggedInId: currentUserLoggedInId,
                    isLike: like
                });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const handleSaveAndUnSavePost = async () => {
        try {

            if (PostToolsType === 'Comment' && setCommentPostId) {
                setCommentPostId((prev) => ({
                    ...prev,
                    savePostId: postId
                }))
                setNewPostId((prev) => ({
                    ...prev,
                    savePost: ''
                }))
            } else {
                setNewPostId((prev) => ({
                    ...prev,
                    savePost: postId
                }))
            }

            if (!isSave) {
                isSavedorUnsaved({
                    postId: postId,
                    currentUserLoggedInId: currentUserLoggedInId,
                    isSave: isSave
                });
            } else {
                isSavedorUnsaved({
                    postId: postId,
                    currentUserLoggedInId: currentUserLoggedInId,
                    isSave: isSave
                });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const handleRepostAndUnRepost = async () => {
        try {

            if (!isRepost) {
                isRepostorUnRepost({
                    postId: postId,
                    userId: currentUserLoggedInId,
                    isRepost: isRepost
                });
            } else {
                isRepostorUnRepost({
                    postId: postId,
                    userId: currentUserLoggedInId,
                    isRepost: isRepost
                });
            }

        } catch (error) {
            console.log(error)
        }
    };

    const handleComment = () => {
        if (PostToolsType === 'Comment' && setCommentPostId) {
            setCommentPostId((prev) => ({
                ...prev,
                likesId: postId
            }))
            setNewPostId((prev) => ({
                ...prev,
                commentLength: postId
            }))
        } else {
            setNewPostId((prev) => ({
                ...prev,
                commentLength: postId
            }))
        }
        setReplyToData(replyTo)
        setPostReplyId(postId)
        setParentPostIds(parentPostIds)
        setPostData(postData)
        onReplyOpen();
    }

    return (
        <div className={`w-full h-full flex justify-between items-center text-black dark:text-white`}>
            <div className='flex duration-700 transition-all justify-center items-center '>
                <p className='text-[12px] dark:text-neutral-400 text-gray-400'>{likes?.length}</p>
                {!like
                    ?
                    <span
                        onClick={handleLikeAndUnlikePost}
                        className='relative like rounded-full p-2'>
                        <GoHeart className='cursor-pointer' />
                    </span>
                    : <span
                        style={{
                            color: '#fc2f8b',
                            scale: scale
                        }}
                        onClick={handleLikeAndUnlikePost}
                        className='relative like rounded-full p-2'
                    >

                        <GoHeartFill className='cursor-pointer' />
                    </span>

                }
            </div>
            <div className='flex duration-700 transition-all justify-center items-center'>
                <p className='text-[12px] dark:text-neutral-400 text-gray-400'>{comments?.length}</p>
                <span
                    onClick={handleComment}
                    className='relative comment rounded-full p-2 hover:bg-[#2f8bfcf3] '>

                    <FaRegComment className='cursor-pointer' />
                </span>
            </div>
            <div className='flex duration-700 transition-all justify-center items-center'>
                <p className='text-[12px] dark:text-neutral-400 text-gray-400'>{reposts?.length}</p>
                {isRepost ?
                    <span
                        onClick={handleRepostAndUnRepost}
                        style={{ color: '#2ffc5b' }}
                        className='relative repost rounded-full p-2 hover:bg-[#2ffc5bf3]   '>
                        <BiRepost className='cursor-pointer ' />
                    </span>
                    :
                    <span
                        onClick={handleRepostAndUnRepost}
                        className='relative repost rounded-full p-2 hover:bg-[#2ffc5bf3]   '>
                        <BiRepost className='cursor-pointer ' />
                    </span>
                }
            </div>
            <div className='flex duration-700 transition-all justify-center items-center'>
                <p className='text-[12px] dark:text-neutral-400 text-gray-400'>{0}</p>
                <span
                    onClick={() => { }}
                    className='relative share rounded-full p-2 hover:bg-[#fcbe2ff3] hover:text-[#c22]  '>

                    <FiShare className='cursor-pointer' />
                </span>
            </div>
            <div className='flex duration-700 transition-all justify-center items-center'>
                <p className='text-[12px] dark:text-neutral-400 text-gray-400'>{saves?.length}</p>
                {!isSave ?
                    <span
                        onClick={handleSaveAndUnSavePost}
                        className='relative save rounded-full p-2 hover:bg-[#fcf92ff3] hover:text-[#c22]  '>
                        <BsSave className='cursor-pointer' />
                    </span>
                    :
                    <span
                        style={{
                            color: '#fcf92f',
                        }}
                        onClick={handleSaveAndUnSavePost}
                        className='relative save rounded-full p-2 hover:bg-[#fcf92ff3] hover:text-[#c22]  '>
                        <BsSaveFill className='cursor-pointer' />
                    </span>
                }
            </div>
        </div>
    )
}

export default PostsTools