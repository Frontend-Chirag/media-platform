"use client"


import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

import FollowButton from './FollowButton';
import { IUsersContainerProps } from '@/types/type';

const UsersContainer: React.FC<IUsersContainerProps> = ({
    receiverId,
    username,
    profilePicture,
    senderId,
    friendRequests,
    followers,
    following,
    isPrivate
}) => {


    return (
        <div className='w-full h-[76px] max-h-[121px] flex justify-between transition-all dark:text-white text-[#000] items-center px-2 py-1  dark:hover:bg-neutral-900 rounded-lg gap-2'>
            <Link href={`/profile/${receiverId}`} className='w-full  flex justify-start items-center gap-2 '>
                <div className='w-[40px] h-[40px] relative '>
                    <Image
                        src={profilePicture ? profilePicture : '/profile-circle.svg'}
                        alt='profile picture'
                        fill
                        className={`rounded-full object-cover ${!profilePicture && 'border-[1px]'} mr-1`}
                    />
                </div>
                <h3 className='truncate'>{username}</h3>
            </Link>

            <FollowButton
                friendRequests={friendRequests}
                senderId={senderId}
                receiverId={receiverId}
                followers={followers}
                following={following}
                isPrivate={isPrivate}
                
            />

        </div>
    )
}

export default UsersContainer