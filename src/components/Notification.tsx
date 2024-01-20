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
import { useConfirmOrRejected } from '@/libs/useConfirm';
import { IUserProps, NotificationData } from '@/types/type';
const Notification = () => {

    const { isNotification } = useNotificationModel();
    const { user } = useUser();
    const { socket } = useSocket();

    const { isSenderConfirmOrRejected, setIsSenderConfirmOrRejected } = useConfirmOrRejected();
    const { NotificationLoading, notificationData } = useNotificationData();
    const [updatedNotificationMessage, setUpdatedNotificationMessage] = useState<NotificationData | null>(null);
    const [newNotificationMessage, setNewNotificationMessage] = useState(false);


    useEffect(() => {

        const checkForNewNotificationMessage = () => {
            notificationData.find((existingMessage) => {
                const newfollowNotificationMessage = updatedNotificationMessage?.userFrom === existingMessage.notificationData.userFrom &&
                    updatedNotificationMessage?.userTo === existingMessage.notificationData.userTo &&
                    updatedNotificationMessage?.notificationType !== existingMessage.notificationData.notificationType;

                    console.log('newfollowNotificationMessage', newfollowNotificationMessage)

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

    }, [socket])


    return (
        <div className={`
        w-[397px] 
        h-full 
        absolute 
        top-0 
        ${!isNotification ? 'left-[-397px] ' : 'left-[100px] '}
        bg-white
        dark:bg-black
        dark:border-neutral-700
        border-gray-400
        transition-all
        px-1
        py-5
        overflow-hidden
        overflow-y-scroll
        flex
        flex-col
        justify-start
        gap-4
        z-[9]
        
        `}>
            <h1 className='text-2xl w-full py-2 dark:text-neutral-200 font-bold text-black'>Notifications</h1>
            {NotificationLoading ?
                <NotificationLoaders />
                :
                <>
                    {notificationData.length > 0 ? (
                        notificationData.map((notify: any, index) => (
                            <div key={index}>
                                {notify.senderUser.map((senderuser: IUserProps) => {

                                    return (
                                        <div className='w-full h-[85px] max-h-[110px]  flex-wrap flex gap-1 dark:bg-black bg-white border-b-black border-b-[1px] dark:border-b-neutral-700  justify-start items-center '>
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

                                            {isSenderConfirmOrRejected ?
                                                <ConfirmRequest
                                                    friendRequests={senderuser.friendRequests}
                                                    senderId={user?._id!}
                                                    receiverId={senderuser._id!}
                                                    notification='notify'
                                                    isSenderConfirmOrRejected={isSenderConfirmOrRejected}
                                                    setIsSenderConfirmOrRejected={setIsSenderConfirmOrRejected}
                                                />
                                                :
                                                <FollowButton
                                                    friendRequests={senderuser.friendRequests}
                                                    senderId={user?._id}
                                                    receiverId={senderuser._id}
                                                    followers={senderuser.followers}
                                                    following={senderuser.following}
                                                    isPrivate={senderuser.isPrivate}

                                                />

                                            }

                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <p>No Notifications available.</p>
                    )}

                </>

            }
        </div>
    )
}

export default Notification