"use client";
import React, { useEffect, useState } from 'react'
import { useUser } from '@/libs/useUser';
import axios from 'axios';
import Image from 'next/image';
import { FadeLoader } from 'react-spinners';
import NotificationFollowRequesteButton from './NotificationFollowRequesteButton';
import Link from 'next/link';
import { useDebounce } from '@/constant';

interface IFollowersTabProps {
    id: string,
    showFollowers: boolean
}

const FollowersTabs: React.FC<IFollowersTabProps> = ({ id, showFollowers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [getFollowingData, setGetFollowingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useUser();
    const debounceSearchFollowers = useDebounce(searchQuery);

    useEffect(() => {

        const handleGetFollowers = async () => {
            try {

                if (id === '') {
                    return;
                }
                if (showFollowers) {
                    setIsLoading(true);

                    const res = await axios.get('/api/users/getFollowers', { params: { _id: id, searchQuery: debounceSearchFollowers } });
                    setGetFollowingData(res.data);


                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error)
            }
        };


        handleGetFollowers()

    }, [debounceSearchFollowers, id, showFollowers])


    return (
        <div className={`w-full   ${showFollowers ? 'h-auto' : 'h-0'} transition-all overflow-hidden `} >
            <div className='w-full h-auto rounded-2xl flex flex-col'>
                <div className='w-full h-[43px] relative border-b-[1px] border-b-gray-200 dark:border-b-neutral-600 flex justify-center items-center '>
                    <h1 className='font-bold text-black dark:text-white'>Followers</h1>
                </div>
                <div className='w-full h-full'>
                    <div className='w-full h-[56px] px-2 py-2  '>
                        <input
                            placeholder='search'
                            className='w-full h-full text-[16px] text-black dark:text-white font-light  bg-gray-200 dark:bg-neutral-700 rounded-lg border-none outline-none p-2'
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                    <div className='w-full h-full flex justify-center items-start'>
                        {isLoading
                            ?
                            <FadeLoader loading={true} color='#2f8bfc' width={3} height={13} />
                            : (getFollowingData.length === 0
                                ? <p className='text-black dark:text-white'>No Following Users</p>
                                : <div className='w-full h-full flex flex-col overflow-hidden overflow-y-auto  custom-scrollbar '>
                                    {getFollowingData.map((data: any) => (
                                        <div key={data.data._id} className='w-full flex justify-between items-center h-[55px] px-2  '>
                                            <Link href={`/profile/${data.data._id}`} className='w-auto h-full flex justify-start items-center gap-3'>
                                                <div className='w-[45px] h-[45px] relative rounded-full overflow-hidden '>
                                                    <Image src={data.data.profilePicture ? data.data.profilePicture : '/profile-circle.svg'} fill alt='profileImage' />
                                                </div>
                                                <div className='w-auto  flex flex-col leading-[18px] line justify-center items-start'>
                                                    <p className='font-bold text-[14px] text-black dark:text-white'>{data.data.username}</p>
                                                    <p className='font-light text-[16px] text-gray-400 dark:text-neutral-400'>{data.data.name}</p>
                                                </div>
                                            </Link>
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

export default FollowersTabs