"use client";

import { useNotificationModel } from '@/libs/useNotificationModel';
import { useUser } from '@/libs/useUser';
import React, { useEffect, useState } from 'react'
import FollowButton from './FollowButton';
import ConfirmRequest from './ConfirmRequest';
import Image from 'next/image';
import { useSocket } from '@/contexts/socket-provider';
import { useNotificationData } from '@/libs/useNotificationdata';
import NotificationLoaders from '@/Loaders/NotificationLoaders';
import { timeAgo } from '@/constant';

import { IUserProps, NotificationData } from '@/types/type';
import { useCheckConfirm } from '@/libs/useCheckConfirm';
import { FaArrowLeft } from 'react-icons/fa';
import NotificationFollowRequesteButton from './NotificationFollowRequesteButton';


const Notification = () => {

    const { user } = useUser();
    const { socket } = useSocket();
    const { isCheckConfirm } = useCheckConfirm();
    const { onNotificationClose, onNotificationOpen, isNotification } = useNotificationModel();
    const { NotificationLoading, notificationData } = useNotificationData();
    

    const [updatedNotificationMessage, setUpdatedNotificationMessage] = useState<NotificationData | null>(null);
    const [newNotificationMessage, setNewNotificationMessage] = useState(false);


    useEffect(() => {

        const checkForNewNotificationMessage = () => {
            notificationData.find((existingMessage) => {
                const newfollowNotificationMessage = updatedNotificationMessage?.userFrom === existingMessage.notificationData.userFrom &&
                    updatedNotificationMessage?.userTo === existingMessage.notificationData.userTo &&
                    updatedNotificationMessage?.notificationType !== existingMessage.notificationData.notificationType;

                if (newfollowNotificationMessage) {
                    setNewNotificationMessage(newfollowNotificationMessage)
                }
            });
        }

        checkForNewNotificationMessage();


    }, [updatedNotificationMessage]);


    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            socket.on('updatedNotification', (data: any) => {
                setUpdatedNotificationMessage(data.updatedNotification)
            })
        });

        return () => {
            socket.off('connect');
            socket.off('updatedNotification')
        }

    }, [socket]);

    // Function for handle notification Model
    const handleNotificationModel = () => {
        if (isNotification) {
            onNotificationClose();
        }
    };

    useEffect(() => {
        console.log('isCheckConfirm', isCheckConfirm);
    }, [isCheckConfirm]);


    return (
        <div className={`
        md:w-[397px]
        w-full 
        h-full 
        absolute 
        top-0 
        ${!isNotification ? 'md:left-[-397px] left-[-100%] ' : 'md:left-[100px] left-0 '}
        bg-white
        dark:bg-black
        
        border-gray-400
        transition-all
        px-1
        py-5
        overflow-hidden
        md:overflow-y-scroll
        overflow-y-auto
        flex
        flex-col
        justify-start
        gap-4
        z-[9]
        
        `}>
            <div className=' w-full flex  justify-start md:items-start items-center gap-4 p-2 md:py-2 md:px-0 h-auto dark:text-neutral-200 font-bold text-black'>
                <FaArrowLeft className='flex md:hidden cursor-pointer' onClick={handleNotificationModel} />
                <h1 className='text-2xl w-full py-2 '>Notifications</h1>
            </div>
            {NotificationLoading ?
                <NotificationLoaders />
                :
                <>
                    {notificationData.length > 0 ? (
                        notificationData.map((notify: any, index) => (
                            <div key={index}>
                                {notify.senderUser.map((senderuser: IUserProps) => {

                                    return (
                                        <div key={senderuser._id} className='w-full h-[85px] max-h-[110px]  flex-wrap flex gap-1 dark:bg-black bg-white border-b-black border-b-[1px] dark:border-b-neutral-700  justify-start items-center '>
                                            <div className='w-[39px] h-[39px] relative'>
                                                <Image
                                                    src={senderuser.profilePicture ? senderuser.profilePicture : '/profile-circle.svg'}
                                                    alt='profile'
                                                    fill
                                                    className='rounded-full bg-black object-cover overflow-hidden'
                                                />
                                            </div>
                                            <div className='flex w-[210px]  text-[14px] text-black dark:text-white flex-wrap'>
                                                <p className=' '>
                                                    <span className='font-semibold text-[15px] mr-[2px]'>
                                                        {senderuser.username}
                                                    </span>

                                                    {newNotificationMessage ? updatedNotificationMessage?.notificationMessage : notify?.notificationData.notificationMessage}

                                                    <span className='text-neutral-400 ml-1'>
                                                        {timeAgo(notify?.notificationData.createdAt)}
                                                    </span>

                                                </p>
                                            </div>

                                            <NotificationFollowRequesteButton
                                                isPrivate={senderuser.isPrivate}
                                                friendRequests={senderuser.friendRequests}
                                                senderId={user?._id!}
                                                receiverId={senderuser._id}
                                                followers={senderuser.followers}
                                                following={senderuser.following}
                                            />

                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <p className='dark:text-white text-black'>No Notifications available.</p>
                    )}
                </>
            }
        </div>
    )
}

export default Notification