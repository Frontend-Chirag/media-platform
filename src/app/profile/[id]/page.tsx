"use client";

import React, { useEffect, useState } from 'react';
import { BsBalloonFill, BsFillSuitcaseLgFill, BsThreeDotsVertical } from 'react-icons/bs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image';

import { useUser } from '@/libs/useUser';
import { useSocket } from '@/contexts/socket-provider';
import { useGetUserById } from '@/queries/quriesAndmutations';
import { FaArrowLeft } from 'react-icons/fa';
import { useMoblieSettingModel } from '@/libs/useMobileSettingModel';
import { FcShare } from 'react-icons/fc';
import { IoLocation, IoSettings } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';
import PostsTab from '@/components/PostsTab';
import { useTheme } from '@/contexts/themeProvider';
import { AiOutlineLink } from 'react-icons/ai';
import { SlCalender } from 'react-icons/sl';
import { useEditModel } from '@/libs/useEditModel';

const ProfileId = () => {
  // Get user id from the route parameters
  const { id } = useParams() as any;
  const router = useRouter();
  // Get the current user from the custom hook
  const { user } = useUser();
  const { setIsEditProfile, setEditFromData } = useEditModel();

  // Get the socket instance from the context
  const { socket } = useSocket();
  const { isOpen, onClose, onOpen } = useMoblieSettingModel();

  const { themeMode } = useTheme();

  const { data: currentProfile, isLoading: profileLoading } = useGetUserById(id);

  // const [currentProfile, setcurrentProfile] = useState<IUserProps | null>(null);
  // State for follower and following count
  const [count, setCount] = useState({
    isFollowers: [],
    isFollowing: []
  });
  const [scrollHeight, setScrollHeight] = useState<number>(0);

  useEffect(() => {
    console.log('profileupdaed')
  },[currentProfile])

  useEffect(() => {
    const statusContainer = document.getElementById('profileContainer');

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

  useEffect(() => {
    setCount({ isFollowers: currentProfile?.data?.followers, isFollowing: currentProfile?.data?.following })
  }, [currentProfile])

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

  }, [socket]);


  const handleSettingModel = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const handleEditModel = () => {
    setIsEditProfile(true);
    setEditFromData({
      backgroundImage: currentProfile?.data?.backgroundImage,
      name: currentProfile?.data?.name,
      bio: currentProfile?.data?.bio,
      profession: currentProfile?.data?.profession,
      profilePicture: currentProfile?.data?.profilePicture,
      dob: currentProfile?.data?.dob,
      link: currentProfile?.data?.link,
      location: currentProfile?.data?.location
    })
  }

  if (profileLoading) {
    return (
      <div className='w-full h-full flex justify-center items-start bg-white dark:bg-black text-black dark:text-white'>
        <ClipLoader color='#2f8bfc' loading size={25} />
      </div>
    )
  }

  // If the currentProfile?.data?.data is not available, return null
  if (!currentProfile) return null;


  return (
    <div id='profileContainer' className='w-full h-full relative flex-col bg-white  lg:flex overflow-hidden overflow-y-auto custom-scrollbar  transition-all text-[#000] dark:text-white dark:bg-[#000]'>

      <div className='w-full h-auto  flex flex-col  backdrop-blur-md  backdrop-filter bg-opacity-60 rounded-[25px]'>
        <div className='w-full h-auto relative flex justify-center items-center flex-col '>
          <div
            style={{
              background: `${themeMode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
              boxShadow: '0, 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(14px)',
            }}
            className={`w-full h-[70px] ${scrollHeight > 70 ? 'sticky top-0 left-0 z-[99]' : 'relative'} flex justify-between text-xl font-bold items-center px-4 gap-6 `}>
            <div className='flex justify-center items-center '>
              <FaArrowLeft
                onClick={() => router.push('/')}
                className='text-[#2f8bfc] cursor-pointer text-2xl'
              />
              <div className='flex flex-col text-start leading-3 fontsfamily ml-4'>
                <h3 className='text-[18px] text-white font-bold'>{currentProfile?.data?.name}</h3>
                <p className='text-[15px] text-gray-400 mt-2 dark:text-neutral-400 font-normal '>{currentProfile?.data?.posts.length} posts</p>
              </div>
            </div>

            <div className='flex justify-center items-center gap-5'>
              <Link
                href='/'
                className='py-1 flex px-3 text-[14px] 
                     dark:text-white text-black rounded-full dark:bg-black bg-white'
              >
                <FcShare />
              </Link>

              <IoSettings
                onClick={handleSettingModel}
                className='text-xl text-white cursor-pointer md:hidden flex'
              />
            </div>

          </div>

          <div className='w-full h-[170px]  flex justify-center items-center relative bg-gray-400 dark:bg-neutral-800'>
            <div className='w-[170px] h-full relative'>
              <Image
                src={currentProfile?.data?.backgroundImage ? currentProfile?.data?.backgroundImage : '/profile-circle.svg'}
                fill
                alt='image'
                className='object-cover'
              />
            </div>
          </div>

          <div className='w-full h-[70px] flex justify-end items-center  relative'>
            <div className='w-[140px] h-[140px] absolute top-[-70px] left-[20px] overflow-hidden rounded-full border-4 dark:border-black border-white'>
              <div className='w-full h-full relative '>
                <Image
                  src={currentProfile?.data?.profilePicture ? currentProfile?.data?.profilePicture : '/profile-circle.svg'}
                  fill
                  alt='profile'
                  className='object-cover'
                />
              </div>
            </div>
            <button onClick={handleEditModel} className='px-3 py-1 text-black mr-6 text-[15px] dark:text-white  rounded-2xl border-2 border-[#2f8bfc] dark:bg-black bg-white hover:bg-gray-200 dark:hover:bg-neutral-700'>
              edit profile
            </button>
          </div>

          <div className=' w-full h-auto mt-[18px] flex flex-col justify-start px-[20px]'>
            <div className='flex flex-col text-start fontsfamily leading-3'>
              <h3 className='text-[18px] text-white font-bold'>{currentProfile?.data?.name}</h3>
              <p className='text-[15px] text-gray-400 mt-3 dark:text-neutral-400 font-normal '>@{currentProfile?.data?.username}</p>
            </div>
            {currentProfile?.data?.bio &&
              <h3 className=' mt-4 mb-4 text-[15px] text-white font-normal '>{currentProfile?.data?.bio}</h3>
            }
            <div className='flex flex-col gap-2 leading-3 tracking-wider font-light text-[15px] text-gray-400  dark:text-neutral-400 '>
              {currentProfile?.data?.profession &&
                <p className='flex justify-start items-center gap-1'><BsFillSuitcaseLgFill /> {currentProfile?.data?.profession}</p>
              }
              {currentProfile?.data?.link &&
                <p className='flex justify-start items-center gap-1'><AiOutlineLink /> <Link className='text-[#2f8bfc]' href={currentProfile?.data?.link}>{currentProfile?.data?.link.replace(/^https:\/\//,"")}</Link></p>
              }
              <div className='flex justify-start items-center gap-2'>
                {currentProfile?.data?.location &&
                  <p className='flex justify-start items-center gap-1'><IoLocation /> {currentProfile?.data?.location}</p>
                }
                {currentProfile?.data?.dob &&
                  <p className='flex justify-start items-center gap-1'><BsBalloonFill />{`Born ${currentProfile?.data?.dob?.date} ${currentProfile?.data?.dob?.month} ${currentProfile?.data?.dob?.year}`}</p>
                }
              </div>
              <p className='flex justify-start items-center gap-1'><SlCalender /> Joined September 2023</p>
            </div>
            <div className='flex text-start gap-2 mt-2'>
              <p className='text-[15px] text-gray-400 mt-2 dark:text-neutral-400 font-normal '><span className='dark:text-white text-black'>{count ? count.isFollowers?.length : currentProfile?.data?.followers} </span>Followers</p>
              <p className='text-[15px] text-gray-400 mt-2 dark:text-neutral-400 font-normal '><span className='dark:text-white text-black'>{count ? count.isFollowing?.length : currentProfile?.data?.following} </span>Following</p>
            </div>
          </div>

          <PostsTab
            currentProfileUserData={{
              name: currentProfile?.data?.name!,
              userName: currentProfile?.data?.username!,
              userProfile: currentProfile?.data?.profilePicture!,
              userId: currentProfile?.data?._id!
            }}
          />

          {/* <Profiletabs
            showFollowers={showFollowers}
            showFollowing={showFollowing}
            showPosts={showPosts}
            currentProfileUserData={{
              name: currentProfile?.data?.name!,
              userName: currentProfile?.data?.username!,
              userProfile: currentProfile?.data?.profilePicture!,
              userId: currentProfile?.data?._id!
            }}
          /> */}

        </div>
      </div>
    </div >
  )
}

export default ProfileId