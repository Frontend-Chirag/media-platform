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


const BottomNav = () => {

    const pathname = usePathname();
    const { isConnected, socket } = useSocket();
    const { isOpen, onClose, onOpen } = useSettingModel();
    const { onNotificationClose, onNotificationOpen, isNotification } = useNotificationModel();
    const { user } = useUser();
    const { profilePicture, _id } = user || {};
    const { themeMode } = useTheme();
    const { isNotificationLoading, onNotificationLoaded, setNotificationData } = useNotificationData();
    const [newNotification, setNewNotification] = useState(true);
    const { onPostOpen } = usePosts();


    const paths = pathname === '/';

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
    };

    if (!paths) {
        return
    }

    return (
        <div className='md:hidden z-[99] flex absolute bottom-0 pt-3 w-full h-[77px] px-4  dark:bg-neutral-900 bg-white shadow-[0_-1px_10px_0px_rgba(0,0,0,0.3)] rounded-t-[50px] '>
            <div className='w-full h-full p-2 flex bg-[rgba(245,244,244,0.66)] dark:bg-[rgba(0,0,0,0.7)] rounded-t-[30px] rounded-b-[50px] gap-1 justify-center items-center '>
                <Link href='/' className={`w-full p-3  flex justify-center items-center`} >
                    {themeMode === 'dark' ? (<svg fill="#fff" width="24px" height="24px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-home">
                        <path d='M18 18V7.132l-8-4.8-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18h4zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2h-6z' />
                    </svg>
                    ) : (
                        <svg fill="#000" width="24px" height="24px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-home">
                            <path d='M18 18V7.132l-8-4.8-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18h4zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2h-6z' />
                        </svg>
                    )
                    }
                </Link>
                <Link href='/search' className={`w-full p-3 flex justify-center items-center`} >
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
                </Link>
                <div onClick={() => onPostOpen()} className={`w-full p-3 cursor-pointer flex justify-center items-center`} >
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

                </div>
                <div onClick={() => { handleNotificationModel(), setNewNotification(false) }}
                    className={`w-full relative p-3 flex justify-center items-center cursor-pointer`} >
                    {newNotification && <div className={`w-2 h-2 rounded-full bg-red-500 absolute top-3 left-12`} />}
                    {
                        themeMode === 'dark' ? (
                            <svg width="24px" className='' height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                <path d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" />
                            </svg>

                        ) : (
                            <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000">
                                <path d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" />
                            </svg>
                        )
                    }
                </div>
                <Link href={`/profile/${_id}`} className='w-full' >
                    <div className={`w-full p-3   flex justify-center items-center `} >
                        <div className='w-[35px] h-[35px] relative'>
                            <Image
                                src={profilePicture ? profilePicture : '/profile-circle.svg'}
                                alt='profile'
                                fill
                                className='rounded-full bg-black object-cover overflow-hidden'
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default BottomNav