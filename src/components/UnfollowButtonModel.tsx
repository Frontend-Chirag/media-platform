'use client';

import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

import { useFollowersFollowingState } from '@/libs/useFollowersFollowingState';
import { useUnFollow } from '@/libs/useUnFollow';

const UnfollowButtonModel = () => {

    const { setUpdatedFollowers, setUpdatedFollowing } = useFollowersFollowingState();
    const { isOpenUnFollow, onCloseUnFollow, unFollowUserId, senderId } = useUnFollow();
    const [isLoading, setIsLoading] = useState(false);


    // Function for handle unFollow user
    const handleUnFollow = async () => {
        try {
            setIsLoading(true);

            const res = await axios.post('/api/socket/unFollow', { unFollowUserId: unFollowUserId, senderId: senderId })

            setUpdatedFollowers(res.data.updatedFollowers)
            setUpdatedFollowing(res.data.updatedFollowing)
            setIsLoading(false);
            onCloseUnFollow();
        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    }

    return (
        <div className={`${isOpenUnFollow ? 'flex' : 'hidden'} w-full  h-full z-[99] justify-center items-center absolute left-0 top-0 bg-[#000000b2]`}>
            <div className='flex  w-[350px] h-[150px] flex-col overflow-hidden justify-center items-center bg-neutral-900  rounded-xl'>
                <p className='text-white text-sm  border-b-[1px] border-neutral-600 w-full h-full flex justify-center items-center '>
                    Are you sure you want to unfollow this user?
                </p>
                <button
                    onClick={handleUnFollow}
                    className=' hover:bg-neutral-800 border-b-[1px] border-neutral-600 text-[#2f8bfc] w-full h-full flex justify-center items-center'>
                    {isLoading
                        ? <ClipLoader color='#fff' size={14} loading={true} />
                        : 'Unfollow'
                    }
                </button>
                <button
                    onClick={onCloseUnFollow}
                    className='hover:bg-neutral-800 text-red-800  w-full h-full flex justify-center items-center'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default UnfollowButtonModel