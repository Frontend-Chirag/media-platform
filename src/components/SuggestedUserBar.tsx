"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { useUser } from '@/libs/useUser';
import { IUserProps } from '@/types/type';
import UsersContainer from './UsersContainer';
import { getSuggestedUsers } from '@/queries/quriesAndmutations';
import { usePathname } from 'next/navigation';

const SuggestedUserBar = () => {

  const { user } = useUser();
  const { username, _id } = user || {};

  const [suggestedUsers, setSuggestedUsers] = useState<IUserProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/update-password',
    '/verify-account',
    '/resend-verification-email',
    '/conversations',
];

const pathName = usePathname();

const shouldHideComponent = isPaths.includes(pathName!);


  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      if (_id) {

        const res = await axios.get('/api/users/getAllUsers');
        setSuggestedUsers(res.data)
      }

      setIsLoading(false)
    };

    fetchData();

  }, [_id])

  // Filter out the current user from the suggestedUsers list
  const filterCurrentUser = suggestedUsers?.filter((user: IUserProps) => user.username !== username);

  if (shouldHideComponent || pathName?.startsWith('/conversations/')) {
    return
  }

  if (isLoading) {
    <div className='w-full h-full flex justify-center items-center'>
      <h1>Loading....</h1>
    </div>
  }

  return (
    <div className='xl:w-[calc(100%-1000px)] lg:w-[calc(100%-700px)] dark:bg-black bg-white h-full hidden md:flex flex-col border-l-[1px] dark:border-l-neutral-500 border-l-gray-400 gap-2 px-6 box-content py-6 '>
      <div className='w-full h-auto border-2 rounded-2xl border-neutral-500 p-4 flex flex-col justify-start items-start'>
        <h1 className='fontsfamily text-xl mb-4 dark:text-neutral-300 text-gray-200 font-bold '>Who to Follow</h1>
        {filterCurrentUser?.map((user: IUserProps) => (
          <UsersContainer
            key={user._id}
            receiverId={user._id}
            senderId={_id}
            username={user.username}
            profilePicture={user.profilePicture}
            friendRequests={user.friendRequests}
            followers={user.followers}
            following={user.following}
            isPrivate={user.isPrivate}
          />
        ))}
      </div>
    </div>
  )
}

export default SuggestedUserBar