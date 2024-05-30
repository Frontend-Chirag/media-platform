"use client";

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios';

import { useSettingModel } from '@/libs/useSettingModel';
import { useUser } from '@/libs/useUser';
import { useNotificationModel } from '@/libs/useNotificationModel';
import { useSocket } from '@/contexts/socket-provider';
import { useTheme } from '@/contexts/themeProvider';
import { useNotificationData } from '@/libs/useNotificationdata';
import { usePosts } from '@/libs/usePost';
import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch';

const RightNavbar = () => {

    const pathname = usePathname();
    const { isConnected, socket } = useSocket();
    const { isOpen, onClose, onOpen } = useSettingModel();
    const { onNotificationClose, onNotificationOpen, isNotification } = useNotificationModel();
    const { user } = useUser();
    const { profilePicture, _id } = user || {};
    const { setConversationId } = useNewMessageUserSearch();
    const { themeMode } = useTheme();
    const { isNotificationLoading, onNotificationLoaded, setNotificationData } = useNotificationData();
    const { onPostOpen } = usePosts()
    const [newNotification, setNewNotification] = useState(false);


    const paths = pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/forgot-password' ||
        pathname === '/verify-account' ||
        pathname === '/update-password' ||
        pathname === '/resend-verification-email' ||
        pathname === '/accessToken-expired'
        ;

    // Effect to listen for 'sendFollowRequestNotification' events from the socket
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            socket.on('sendFollowRequestNotification', (notify: any) => {
                setNewNotification(notify.newNotification)
            })
        });

        return () => {
            socket.off('sendFollowRequestNotification');
            socket.off('connect')
        }

    }, [socket])

    // Function for handle setting Model
    const handleSettingModel = () => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    }

    // Function for handle notification
    const handleNotification = async () => {
        try {
            isNotificationLoading();

            const res = await axios.get(`/api/socket/notification/${user?.name}`);

            setNotificationData(res.data.notify)

            onNotificationLoaded();
        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    }

    // Function for handle notification Model
    const handleNotificationModel = () => {
        if (isNotification) {
            onNotificationClose();
        } else {
            onNotificationOpen();
            handleNotification()
        }
    }


    if (paths) {
        return
    }

    return (
        <div className={` ${isNotification ? 'w-[100px]  ' : 'xl:w-[320px] lg:w-[100px] '}   md:flex md:flex-col hidden
        transition-all col-span-1 h-full dark:bg-[#000] dark:text-white text-black bg-white
        border-r-[1px] dark:border-r-neutral-500 border-r-gray-400 relative fontsfamily`}>
            {
                isConnected ? <span className='w-2 h-2 rounded-full bg-green-400 '></span>
                    : <span className='w-2 h-2 rounded-full bg-red-400 '></span>
            }
            <div className='w-full h-[70px] border-b-[1px] border-gray-300 dark:border-b-neutral-500 gap-10 flex justify-center items-center'>
                <Image
                    src={'/logo-blue.png'}
                    width={80}
                    height={80}
                    alt='logo'
                />
            </div>
            <div className='w-full h-[calc(100%-170px)] py-4 px-6  box-border flex justify-center items-center flex-col gap-6'>

                <Link href='/' className={`w-full p-3 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all rounded-md flex ${isNotification ? 'justify-center items-center' : 'justify-center items-center xl:justify-start xl:items-center'}`} >
                    {themeMode === 'dark' ? (<svg fill="#fff" width="24px" height="24px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-home">
                        <path d='M18 18V7.132l-8-4.8-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18h4zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2h-6z' />
                    </svg>
                    ) : (
                        <svg fill="#000" width="24px" height="24px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-home">
                            <path d='M18 18V7.132l-8-4.8-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18h4zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2h-6z' />
                        </svg>
                    )
                    }
                    {!isNotification && <p className='ml-2 font-bold text-lg hidden xl:flex'>Home</p>}
                </Link>
                <Link href='/search' className={`w-full p-3 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all rounded-md flex ${isNotification ? 'justify-center items-center' : 'justify-center items-center xl:justify-start xl:items-center'}`} >
                    {themeMode === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>

                    ) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>)
                    }
                    {!isNotification && <p className='ml-2 font-bold text-lg hidden xl:flex' >Search</p>}
                </Link>
                <Link href='/conversations' onClick={() => setConversationId('')} className={`w-full p-3 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all rounded-md flex ${isNotification ? 'justify-center items-center' : 'justify-center items-center xl:justify-start xl:items-center'}`} >
                    {themeMode === 'dark' ? (<svg version="1.1" id="Capa_1" width="22px" fill="#fff" height="22px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 217.762 217.762" xmlSpace="preserve">
                        <path d="M108.881,5.334C48.844,5.334,0,45.339,0,94.512c0,28.976,16.84,55.715,45.332,72.454
	                                       c-3.953,18.48-12.812,31.448-12.909,31.588l-9.685,13.873l16.798-2.153c1.935-0.249,47.001-6.222,79.122-26.942
	                                       c26.378-1.92,50.877-11.597,69.181-27.364c19.296-16.623,29.923-38.448,29.923-61.455C217.762,45.339,168.918,5.334,108.881,5.334z
	                                       M115.762,168.489l-2.049,0.117l-1.704,1.145c-18.679,12.548-43.685,19.509-59.416,22.913c3.3-7.377,6.768-17.184,8.499-28.506
	                                       l0.809-5.292l-4.741-2.485C30.761,142.547,15,119.42,15,94.512c0-40.901,42.115-74.178,93.881-74.178s93.881,33.276,93.881,74.178
	                                       C202.762,133.194,164.547,165.688,115.762,168.489z"
                        />
                    </svg>

                    ) : (<svg version="1.1" id="Capa_1" width="22px" fill="#000" height="22px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 217.762 217.762" xmlSpace="preserve">
                        <path d="M108.881,5.334C48.844,5.334,0,45.339,0,94.512c0,28.976,16.84,55.715,45.332,72.454
	                                         c-3.953,18.48-12.812,31.448-12.909,31.588l-9.685,13.873l16.798-2.153c1.935-0.249,47.001-6.222,79.122-26.942
	                                         c26.378-1.92,50.877-11.597,69.181-27.364c19.296-16.623,29.923-38.448,29.923-61.455C217.762,45.339,168.918,5.334,108.881,5.334z
	                                         M115.762,168.489l-2.049,0.117l-1.704,1.145c-18.679,12.548-43.685,19.509-59.416,22.913c3.3-7.377,6.768-17.184,8.499-28.506
	                                         l0.809-5.292l-4.741-2.485C30.761,142.547,15,119.42,15,94.512c0-40.901,42.115-74.178,93.881-74.178s93.881,33.276,93.881,74.178
	                                         C202.762,133.194,164.547,165.688,115.762,168.489z"
                        />
                    </svg>
                    )}
                    {!isNotification && <p className='ml-2 font-bold text-lg hidden xl:flex'>Conversations</p>}
                </Link>
                <div onClick={() => { handleNotificationModel(), setNewNotification(false) }} className={`w-full relative p-3 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all rounded-md flex ${isNotification ? 'justify-center items-center' : 'justify-center items-center xl:justify-start xl:items-center'}`} >
                    {newNotification && <div className={`w-2 h-2 rounded-full bg-red-500 absolute top-3 left-3`} />}
                    {
                        themeMode === 'dark' ? (
                            <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                <path d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" />
                            </svg>

                        ) : (
                            <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000">
                                <path d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" />
                            </svg>
                        )
                    }
                    {!isNotification && <p className='ml-2 font-bold text-lg hidden xl:flex'>Notifications</p>}
                </div>
                <div onClick={() => onPostOpen()} className={`w-full p-3 cursor-pointer dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all rounded-md flex ${isNotification ? 'justify-center items-center' : 'justify-center items-center xl:justify-start xl:items-center'}`} >
                    {themeMode === 'dark' ? (
                        <svg width="24px" height="24px" fill="#fff" viewBox="0 0 24 24" id="magicoon-Regular" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                {/* <style>.cls-1{fill:#fff;}</style> */}
                            </defs>
                            <title>plus-square</title>
                            <g id="plus-square-Regular">
                                <path id="plus-square-Regular-2" data-name="plus-square-Regular" className="cls-1" d="M15,2.25H9A6.758,6.758,0,0,0,2.25,9v6A6.758,6.758,0,0,0,9,21.75h6A6.758,6.758,0,0,0,21.75,15V9A6.758,6.758,0,0,0,15,2.25ZM20.25,15A5.256,5.256,0,0,1,15,20.25H9A5.256,5.256,0,0,1,3.75,15V9A5.256,5.256,0,0,1,9,3.75h6A5.256,5.256,0,0,1,20.25,9Zm-3.5-3a.75.75,0,0,1-.75.75H12.75V16a.75.75,0,0,1-1.5,0V12.75H8a.75.75,0,0,1,0-1.5h3.25V8a.75.75,0,0,1,1.5,0v3.25H16A.75.75,0,0,1,16.75,12Z" /></g></svg>

                    ) : (
                        <svg width="24px" height="24px" fill="#000" viewBox="0 0 24 24" id="magicoon-Regular" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                {/* <style>.cls-1{fill:#fff;}</style> */}
                            </defs>
                            <title>plus-square</title>
                            <g id="plus-square-Regular">
                                <path id="plus-square-Regular-2" data-name="plus-square-Regular" className="cls-1" d="M15,2.25H9A6.758,6.758,0,0,0,2.25,9v6A6.758,6.758,0,0,0,9,21.75h6A6.758,6.758,0,0,0,21.75,15V9A6.758,6.758,0,0,0,15,2.25ZM20.25,15A5.256,5.256,0,0,1,15,20.25H9A5.256,5.256,0,0,1,3.75,15V9A5.256,5.256,0,0,1,9,3.75h6A5.256,5.256,0,0,1,20.25,9Zm-3.5-3a.75.75,0,0,1-.75.75H12.75V16a.75.75,0,0,1-1.5,0V12.75H8a.75.75,0,0,1,0-1.5h3.25V8a.75.75,0,0,1,1.5,0v3.25H16A.75.75,0,0,1,16.75,12Z" /></g></svg>
                    )
                    }
                    {!isNotification && <p className='ml-2 font-bold text-lg hidden xl:flex'>Create</p>}
                </div>

                <Link href={`/profile/${_id}`} className='w-full' >
                    <div className={`w-full p-3 dark:hover:bg-neutral-900 hover:bg-gray-200 transition-all gap-2 rounded-md flex ${!isNotification ? 'xl:justify-start justify-center ' : 'justify-center'} items-center`} >
                        <div className='w-[35px] h-[35px] relative'>
                            <Image
                                src={profilePicture ? profilePicture : '/profile-circle.svg'}
                                alt='profile'
                                fill
                                className='rounded-full bg-black object-cover overflow-hidden'
                            />
                        </div>
                        {!isNotification && <h3 className='font-bold text-lg hidden xl:flex'>Profile</h3>}
                    </div>
                </Link>
            </div>
            <div className='w-full h-[100px] p-2 px-6 border-t-[1px] border-gray-300 dark:border-t-neutral-500 flex justify-start flex-col items-start cursor-pointer'>
                <div className={`w-full p-3 dark:hover:bg-neutral-900 hover:bg-gray-200  transition-all rounded-md flex ${!isNotification ? 'xl:justify-start justify-center' : 'justify-center'} items-center`} onClick={handleSettingModel}>
                    {themeMode === 'dark' ? (
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <title>bar</title>
                            <desc>Created with sketchtool.</desc>
                            <g id="web-app" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="bar" fill="#fff">
                                    <path d="M3,16 L21,16 L21,18 L3,18 L3,16 Z M3,11 L21,11 L21,13 L3,13 L3,11 Z M3,6 L21,6 L21,8 L3,8 L3,6 Z" id="Shape"></path>
                                </g>
                            </g>
                        </svg>

                    ) : (
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <title>bar</title>
                            <desc>Created with sketchtool.</desc>
                            <g id="web-app" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="bar" fill="#000">
                                    <path d="M3,16 L21,16 L21,18 L3,18 L3,16 Z M3,11 L21,11 L21,13 L3,13 L3,11 Z M3,6 L21,6 L21,8 L3,8 L3,6 Z" id="Shape"></path>
                                </g>
                            </g>
                        </svg>
                    )
                    }
                    {!isNotification &&
                        <h3 className='ml-2 hidden font-bold text-lg xl:flex'>More</h3>
                    }
                </div>
            </div>
        </div>
    )
}

export default RightNavbar