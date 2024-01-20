"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useParams } from 'next/navigation';
import { useUser } from '@/libs/useUser';
import Image from 'next/image';
import axios from 'axios';
import FollowButton from '@/components/FollowButton';
import ConfirmRequest from '@/components/ConfirmRequest';
import { useSocket } from '@/contexts/socket-provider';
import { useConfirmOrRejected } from '@/libs/useConfirm';
import { IUserProps } from '@/types/type';


const ProfileId = () => {
  // Get user id from the route parameters
  const params = useParams();
  const id = params?.id;

  // Get the current user from the custom hook
  const { user } = useUser();
  const { _id } = user || {};

  // Get the socket instance from the context
  const { socket } = useSocket();

  // State for handling confirmations or rejections
  const { isSenderConfirmOrRejected, setIsSenderConfirmOrRejected } = useConfirmOrRejected();

  // State for current user details
  const [currentUser, setCurrentUser] = useState<IUserProps | null>(null);

  // State for follower and following count
  const [count, setCount] = useState({
    isFollowers: currentUser?.followers,
    isFollowing: currentUser?.following
  })

  // Fetch user details by ID on component mount
  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axios.post('/api/users/getUserById', { id: id });
      setCurrentUser(data);
      setCount({ isFollowers: data.followers, isFollowing: data.following })
    };
    getUsers();
  }, [id]);

  // Subscribe to socket events for follower and following count updates
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      socket.on('updatedFollowers', (data: any) => {
        console.log('followers', data)
        setCount({ ...count, isFollowers: data.followers })
      });

      socket.on('updatedFollowing', (data: any) => {
        console.log('following', data)
        setCount({ ...count, isFollowing: data.following })
      });
    });

    // Unsubscribe from socket events when component unmounts
    return () => {
      socket.off('updatedFollowers');
      socket.off('updatedFollowing');
    }

  }, [socket, count]);

  // If the currentUser is not available, return null
  if (!currentUser) return null;


  return (
    <div className='w-full h-full flex-col overflow-hidden overflow-y-auto p-5 transition-all text-[#000] dark:text-white  bg-[#fff] dark:bg-[#000]'>
      <div className=' w-full h-[74px]'>
        <ConfirmRequest
          friendRequests={currentUser.friendRequests}
          senderId={_id!}
          receiverId={id!}
          notification='profile'
          isSenderConfirmOrRejected={isSenderConfirmOrRejected}
          setIsSenderConfirmOrRejected={setIsSenderConfirmOrRejected}
        />
      </div>
      <div className='w-full h-auto relative rounded-xl flex p-3 '>

        <div className='relative w-[34%] h-full flex justify-center items-center'>
          <div className='w-[200px] h-[200px] rounded-full relative shadow shadow-neutral-400'>
            <Image
              src={currentUser.profilePicture ? currentUser.profilePicture : '/profile-circle.svg'}
              alt='profile picture'
              fill
              className='rounded-full object-cover shadow shadow-neutral-400 '
            />
          </div>
        </div>

        <div className='w-[66%] h-full '>
          <div className='w-full flex justify-start items-center gap-5 px-8'>
            <h1 className='text-[20px] shadow shadow-neutral-400 p-2 rounded-xl'>{currentUser.name}</h1>
            {_id === id ? (
              <Link href={`/edit`} className='px-4 py-2 bg-gray-200 dark:bg-neutral-800 rounded-lg ml-4 hover:shadow hover:shadow-neutral-400 transition-all' >
                Edit profile
              </Link>
            )
              :
              (
                <FollowButton
                  friendRequests={currentUser.friendRequests}
                  senderId={_id}
                  receiverId={id}
                  followers={currentUser.followers}
                  following={currentUser.following}
                  isPrivate={currentUser.isPrivate}
                />
              )
            }
          </div>
          <div className='w-full flex justify-start items-center gap-5 px-8 mt-4 '>
            <span className=' text-[16px] text-sm shadow shadow-neutral-400 p-2 rounded-xl'>
              {currentUser.posts.length} posts
            </span>
            <span className='text-[16px] text-sm shadow shadow-neutral-400 p-2 rounded-xl'>
              {count.isFollowers?.length} followers
            </span>
            <span className=' text-[16px] text-sm shadow shadow-neutral-400 p-2 rounded-xl'>
              {count.isFollowing?.length} following
            </span>
          </div>

          <div className='w-full flex justify-start items-center gap-5 px-8 mt-4 '>
            <h3 className='text-[14px] font-semibold shadow shadow-neutral-400 p-2 rounded-xl'> {currentUser.username}</h3>
          </div>

          <div className='w-full flex justify-start items-center gap-5 px-8 mt-4 '>
            <p className='text-[14px] whitespace-pre-wrap shadow shadow-neutral-400 p-2 rounded-xl'> {currentUser.bio}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileId