'use client';

import ViewPostCard, { viewPostCardProps } from '@/UIModels/ViewPostCard';
import { useTheme } from '@/contexts/themeProvider';
import { useUser } from '@/libs/useUser';
import { useGetAllSavedPosts } from '@/queries/quriesAndmutations';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners';

const BookMarks = () => {

    const { user } = useUser();
    const { themeMode } = useTheme();
    const [scrollHeight, setScrollHeight] = useState<number>(0);
    const { data, isFetching } = useGetAllSavedPosts(user?._id!);


    useEffect(() => {
        const statusContainer = document.getElementById('bookmarkContainer');

        statusContainer?.addEventListener('scroll', () => {
            const windowHeight = statusContainer.scrollTop;
            setScrollHeight(windowHeight);
        })

        return () => {
            statusContainer?.removeEventListener('scroll', () => {
                const windowHeight = statusContainer.scrollTop;
                setScrollHeight(windowHeight);
            })
        }

    }, [scrollHeight]);

    return (
        <div id='bookmarkContainer' className='w-full h-full relative dark:bg-black bg-white overflow-hidden overflow-y-auto  custom-scrollbar'>
            <div
                style={{
                    background: `${themeMode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
                    boxShadow: '0, 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    backdropFilter: 'blur(14px)',
                }}
                className={`w-full h-[70px] ${scrollHeight > 70 ? 'sticky top-0 left-0 z-[99]' : 'relative'} flex justify-start text-xl font-bold items-center px-4 gap-6 `}>
                <FaArrowLeft
                    onClick={() => { }}
                    className='text-[#2f8bfc]  cursor-pointer  z-[5]'
                />
                <div className='w-auto h-full flex flex-col leading-6 justify-center items-start'>
                    <p className='dark:text-white text-black text-[19px]'>
                        Bookmarks
                    </p>
                    <p className='dark:text-neutral-400 font-light text-gray-400 text-[14px]'>
                        @{user?.username}
                    </p>
                </div>
            </div>
            {isFetching
                ?
                <div className='w-full flex justify-center'>
                    <ClipLoader size={20} loading color='#2f8bfc' />
                </div>
                :
                <div className='w-full h-auto py-4'>
                    {data?.data.allSavedPosts.length === 0 ?
                        <div className='w-full h-[70px] text-center'>
                            <p className='text-lg dark:text-neutral-500 text-gray-400'>No post yet saved</p>
                        </div>
                        : (data?.data.allSavedPosts?.map((posts: any, index: number) => (
                            <div key={index} className='w-full h-auto flex justify-center '>
                                <div className='w-full h-auto flex justify-center'>
                                    <ViewPostCard
                                        postsData={{
                                            _id: posts.savePostdata._id,
                                            caption: posts.savePostdata.caption,
                                            audio: posts.savePostdata.audio,
                                            comments: posts.savePostdata.comments,
                                            likes: posts.savePostdata.likes,
                                            savePosts: posts.savePostdata.savePosts,
                                            reposts: posts.savePostdata.reposts,
                                            media: posts.savePostdata.media,
                                            userId: posts.savePostdata.userId,
                                            isPinned: posts.savePostdata.isPinned,
                                            createdAt: posts.savePostdata.createdAt,
                                            updatedAt: posts.savePostdata.updatedAt,
                                            userData: {
                                                name: posts.userdata.name,
                                                _id: posts.userdata._id,
                                                username: posts.userdata.username,
                                                profilePicture: posts.userdata.profilePicture
                                            }
                                        }}

                                        viewPostCardType='bookmarks'
                                    />
                                </div>
                            </div>
                        )))
                    }
                </div>
            }
        </div>
    )
}

export default BookMarks