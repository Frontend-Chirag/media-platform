"use client";

import React, { useEffect, useState } from 'react'
import { IUseNewMedia } from './Post';

import { useGetCommentsLength, useGetLikes, useGetPosts, useGetSavePost, } from '@/queries/quriesAndmutations';
import { usePostCard } from '@/libs/usePostCard';
import { ClipLoader } from 'react-spinners';
import ViewPostCard from '@/UIModels/ViewPostCard';
import PostsTools from '@/UIModels/PostsTools';
import { useUser } from '@/libs/useUser';
import { usePostTools } from '@/libs/usePostTools';
// import { useRouter } from 'next/router';

interface IPostsTabProps {
    currentProfileUserData: {
        userId: string,
        userProfile: string,
        userName: string;
        name: string;
    }
}

export interface IPostDataProps {
    _id: string,
    caption: string,
    audio?: {
        url: string,
        title: string
        artist: string,
        endTime: number,
        startTime: number,
    },
    isPinned?: boolean,
    comments: [],
    likes: [],
    savePosts: [],
    reposts: [],
    media: IUseNewMedia[],
    userId: string,
    createdAt: Date;
    updatedAt: Date;
    parentPostsData?: IPostDataProps[];
    userData: {
        name: string,
        username: string,
        profilePicture: string;
        _id: string;
    }
}

const PostsTab: React.FC<IPostsTabProps> = ({ currentProfileUserData, }) => {

    const { data: allPosts, isLoading: IsPostLoading } = useGetPosts(currentProfileUserData.userId);
    const { isPostCard, setPostData } = usePostCard();
    const { user } = useUser();
    const { newPostId } = usePostTools()
    const { data: likes } = useGetLikes(newPostId.likes);
    const { data: savePost } = useGetSavePost(newPostId.savePost);
    const { data: commentsLength } = useGetCommentsLength(newPostId.commentLength);
    const [allPostData, setAllPostsData] = useState<IPostDataProps[]>([])
    // const { data: res } = useGetPostsById(postId);

    useEffect(() => {
        setAllPostsData(allPosts?.data?.posts[0]?.posts)
    }, [allPosts]);

    useEffect(() => {
        if (likes) {
            if (isPostCard) {
                setPostData((prev) => ({
                    ...prev,
                    likes: likes?.data?.likes
                }))
            }
            setAllPostsData((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.likes);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], likes: likes?.data?.likes }
                };

                return newPostData
            })
        }
    }, [likes?.data?.likes]);

    useEffect(() => {
        if (savePost) {
            if (isPostCard) {
                setPostData((prev) => ({
                    ...prev,
                    savePosts: savePost?.data?.savePosts
                }))
            }
            setAllPostsData((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.savePost);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], savePosts: savePost?.data?.savePosts }
                };

                return newPostData
            })
        }
    }, [savePost?.data?.savePosts]);

    useEffect(() => {
        if (commentsLength) {
            if (isPostCard) {
                setPostData((prev) => ({
                    ...prev,
                    comments: commentsLength?.data?.comments
                }))
            }
            setAllPostsData((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.commentLength);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], comments: commentsLength?.data?.comments }
                };
                return newPostData;
            })
        }
    }, [commentsLength?.data?.comments]);

    return (
        <div className={`w-full h-auto `}>
            {IsPostLoading
                ? <div className='w-full flex justify-center'>
                    <ClipLoader size={20} loading color='#2f8bfc' />
                </div>
                :
                <div className='w-full h-auto'>
                    {allPostData?.length < 0
                        ?
                        <div className='w-full h-[70px] text-center'>
                            <p className='text-lg dark:text-neutral-500 text-gray-400'>No post yet saved</p>
                        </div>
                        :
                        <div className='w-full h-auto flex flex-col'>
                            {allPostData?.map((postList: IPostDataProps, index) => (
                                <div key={index} className='w-full h-auto flex items-end flex-col border-b-[1px] border-gray-400 dark:border-neutral-700'>
                                    <ViewPostCard
                                        postsData={postList}
                                        viewPostCardType='PostCard'
                                    />
                                    <div className='w-[calc(100%-50px)] h-[60px] flex justify-center items-center bg-white dark:bg-black px-4  '>
                                        <PostsTools
                                            postId={postList?._id!}
                                            currentUserLoggedInId={user?._id!}
                                            PostToolsType={'PostCard'}
                                            likes={postList?.likes!}
                                            saves={postList?.savePosts!}
                                            postData={{
                                                name: postList?.userData?.name!,
                                                username: postList?.userData?.username!,
                                                caption: postList?.caption!,
                                                profilePicture: postList?.userData?.profilePicture!,
                                            }}
                                            reposts={postList?.reposts!}
                                            comments={postList?.comments!}
                                            replyTo={{ userId: postList?.userData?._id, username: postList?.userData?.username }}
                                            parentPostIds={[postList?._id]}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default PostsTab