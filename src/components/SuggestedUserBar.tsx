"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { useUser } from '@/libs/useUser';
import { IUserProps } from '@/types/type';
import UsersContainer from './UsersContainer';


const SuggestedUserBar = () => {

  const [suggestedUsers, setSuggestedUsers] = useState<IUserProps[]>([]);
  const { user } = useUser();
  const { username, _id } = user || {};



  // Effect to fetch suggested users when the component mounts
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get('/api/users/getAllUsers');
        const suggestedUsersData: IUserProps[] = response.data;
        setSuggestedUsers(suggestedUsersData);
      } catch (error: any) {
        console.log(error);
        throw new Error(error)
      }
    };

    fetchSuggestedUsers();
  }, []);

  // Filter out the current user from the suggestedUsers list
  const filterCurrentUser = suggestedUsers.filter((user) => user.username !== username);


  return (
    <div className='w-[367px] h-full hidden md:flex flex-col    shadow-md shadow-gray-400 dark:shadow-neutral-700 gap-2 px-2 py-6 '>
      <h1 className='text-lg font-semibold ml-3'>Suggested for you</h1>
      {filterCurrentUser.map((user) => (
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
  )
}

export default SuggestedUserBar