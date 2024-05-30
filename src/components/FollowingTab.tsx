"use client";
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useUser } from '@/libs/useUser';
import axios from 'axios';
import Image from 'next/image';
import { FadeLoader } from 'react-spinners';
import NotificationFollowRequesteButton from './NotificationFollowRequesteButton';
import Link from 'next/link';
import { useDebounce } from '@/constant';

interface IFollowingTabProps {
    id: string,
    showFollowing: boolean;
    type: 'tag' | 'profile';
    handleTag?: (id: string, username: string, image: string, name: string) => void;
    tagSearchQuery?: string;

}

const FollowingTab: React.FC<IFollowingTabProps> = ({ id, showFollowing, type, handleTag, tagSearchQuery }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [getFollowersData, setGetFollowersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useUser();

    const debounceSearchFollowing = useDebounce(tagSearchQuery ? tagSearchQuery : searchQuery);

    useEffect(() => {
        const handleGetFollowers = async () => {
            try {

                if (id === '') {
                    return;
                }
                console.log('not following')
                if (showFollowing) {
                    console.log('following')
                    setIsLoading(true);

                    const newSearchQuery = debounceSearchFollowing?.replace('@', '');
                    console.log(newSearchQuery)
                    const res = await axios.get('/api/users/getFollowing', { params: { _id: id, searchQuery: newSearchQuery } });
                    setGetFollowersData(res.data);

                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error)
            }
        };

        handleGetFollowers()

    }, [debounceSearchFollowing, id, showFollowing])


    return (
        <div className={`w-full ${type === 'tag' && 'h-[350px]'}  ${!showFollowing ? 'h-0' : 'h-auto'} transition-all overflow-hidden`} >
            <div className='w-full h-full rounded-2xl flex flex-col'>
                {type === 'profile' &&
                    <div className='w-full h-[43px] relative border-b-[1px] border-b-gray-200 dark:border-b-neutral-600 flex justify-center items-center '>
                        <h1 className='font-bold text-black dark:text-white'>Followings
                        </h1>
                    </div>
                }
                <div className='w-full h-full'>
                    {type === 'profile' &&
                        <div className='w-full h-[56px] px-2 py-2  '>

                            <input
                                placeholder='search'
                                className={`w-full h-full text-[16px] text-black dark:text-white font-light   bg-gray-200 dark:bg-neutral-700
                                     rounded-lg border-none outline-none p-2`}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}

                            />

                        </div>
                    }
                    <div className='w-full h-full flex justify-center items-start '>
                        {isLoading
                            ? <FadeLoader loading={true} color='#2f8bfc' width={3} height={13} />
                            : (getFollowersData.length === 0
                                ? <p className='text-black dark:text-white'>No Following Users</p>
                                : <div className={`w-full h-auto flex flex-col overflow-hidden overflow-y-auto custom-scrollbar `}>
                                    {getFollowersData.map((data: any) => (
                                        <div onClick={() => handleTag && handleTag(data.data._id, data.data.username, data.data.profilePicture, data.data.name)} key={data.data._id} className={`w-full flex justify-between items-center h-[55px] rounded-md cursor-pointer px-2 ${type === 'tag' && 'hover:bg-gray-200 dark:hover:bg-neutral-700'}`}>
                                            {type === 'profile'
                                                ? <Link href={`/profile/${data.data._id}`} className='w-auto h-full flex justify-start   items-center gap-3'>
                                                    <div className='w-[45px] h-[45px] relative rounded-full overflow-hidden '>
                                                        <Image src={data.data.profilePicture ? data.data.profilePicture : '/profile-circle.svg'} fill alt='profileImage' />
                                                    </div>
                                                    <div className='w-auto  flex flex-col leading-[18px] line justify-center items-start'>
                                                        <p className='font-bold text-[14px] text-black dark:text-white'>{data.data.username}</p>
                                                        <p className='font-light text-[16px] text-gray-400 dark:text-neutral-400'>{data.data.name}</p>
                                                    </div>
                                                </Link>
                                                : <div className='w-auto h-full flex justify-start items-center gap-3'>
                                                    <div className='w-[45px] h-[45px] relative rounded-full overflow-hidden '>
                                                        <Image src={data.data.profilePicture ? data.data.profilePicture : '/profile-circle.svg'} fill alt='profileImage' />
                                                    </div>
                                                    <div className='w-auto  flex flex-col leading-[18px] line justify-center items-start'>
                                                        <p className='font-bold text-[14px] text-black dark:text-white'>{data.data.username}</p>
                                                        <p className='font-light text-[16px] text-gray-400 dark:text-neutral-400'>{data.data.name}</p>
                                                    </div>
                                                </div>
                                            }
                                            {type === 'profile' &&
                                                <>
                                                    {user?._id === data.data._id
                                                        ? ''
                                                        : <NotificationFollowRequesteButton
                                                            isPrivate={data.data.isPrivate}
                                                            friendRequests={data.data.friendRequests}
                                                            senderId={user?._id!}
                                                            receiverId={data.data._id}
                                                            followers={data.data.followers}
                                                            following={data.data.following}
                                                        />
                                                    }
                                                </>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FollowingTab