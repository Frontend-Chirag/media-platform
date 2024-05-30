"use client";

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/socket-provider';
import axios from 'axios';
import { FriendRequestStatus, INotificationFollowRequestButtonProps } from '@/types/type';
import { useUnFollow } from '@/libs/useUnFollow';
import { ClipLoader } from 'react-spinners';
import { FaTimes } from 'react-icons/fa';
import ConfirmRequest from './ConfirmRequest';



const NotificationFollowRequesteButton: React.FC<INotificationFollowRequestButtonProps> = ({
    isPrivate,
    friendRequests,
    senderId,
    receiverId,
    followers,
    following,
}) => {

    const { socket } = useSocket();
    const { isOpenUnFollow, onOpenUnFollow, setUnFollowUserId, setSenderId } = useUnFollow();

    const [isLoading, setIsLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isFollowers, setIsFollowers] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isCancelLoading, setIsCancelLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [isSenderConfirmOrRejected, setIsSenderConfirmOrRejected] = useState(false);

    const [senderConfirmOrRejected, setSenderConfirmOrRejected] = useState(friendRequests);
    const [receiverRequests, setReceiverRequests] = useState(friendRequests);
    const [newfollowers, setNewFollowers] = useState(followers);
    const [newfollowing, setNewFollowing] = useState(following);

    // Effect to check if the sender is already following the receiver
    useEffect(() => {
        if (Array.isArray(newfollowers) && Array.isArray(newfollowing)) {

            const isFindingFollowers = newfollowers.some((followerId) =>
                followerId === senderId
            );

            const isFindingFollowing = newfollowing.some((followingId) =>
                followingId === senderId
            );

            setIsFollowers(isFindingFollowers)
            setIsFollowing(isFindingFollowing)

        }

    }, [newfollowers, newfollowing, senderId]);


    // Effect to check if a follow request has been sent
    useEffect(() => {
        if (Array.isArray(receiverRequests)) {
            const isRequestedSent = receiverRequests.some((request) =>
                request.senderId === senderId && request.status === 'pending'
            );
            setIsRequested(isRequestedSent)
        }
    }, [receiverRequests, senderId]);


    useEffect(() => {
        if (Array.isArray(senderConfirmOrRejected)) {
            const isSenderConfirmOrRejectedsent = senderConfirmOrRejected.some((request) =>
                request.receiverId === senderId && request.status === 'pending'
            );
            console.log('isSenderConfirmOrRejectedsent', isSenderConfirmOrRejectedsent)
            setIsSenderConfirmOrRejected(isSenderConfirmOrRejectedsent);
        }

    }, [senderConfirmOrRejected, receiverId, senderId, isSenderConfirmOrRejected]);

    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            socket.on('confirmRequest', (data: any) => {
                const isFollowRequestExists = data.senderUser.friendRequests.find((isExists: FriendRequestStatus) => {
                    return isExists.receiverId === senderId && isExists.status === 'pending'
                });

                if (data.senderUser._id === receiverId) {
                    console.log(data.senderUser._id === receiverId)
                    setSenderConfirmOrRejected(data.senderUser.friendRequests);
                }
                if (data.senderUser._id === receiverId && isFollowRequestExists) {
                    if (Notification.permission === 'granted') {
                        new Notification('Notification', {
                            body: `${data.senderUser.username} send you a ${(isFollowers) ? 'follow back request' : 'follow request'}`,
                            icon: `${data.senderUser.profilePicture ? data.senderUser.profilePicture : '/profile-circle.svg'}`
                        })
                    }
                }
            });

            return () => {
                socket.off('confirmRequest');
                socket.off('connect')
            }
        })
    }, [socket, receiverId]);

    // Effect to Listen for 'followRequest' events from the socket
    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            socket.on('followRequest', (data: any) => {
                if (data.receiverUser._id === receiverId) {
                    setReceiverRequests(data.receiverUser.friendRequests);
                }
            });
        });

        return () => {
            socket.off('followRequest');
        }
    }, [socket, receiverId]);


    // Effect to listen for updates in followers  lists from the socket
    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            socket.on('updatedFollowers', (data: any) => {
                console.log('updatedFollowers', data._id === receiverId)
                if (data._id === receiverId) {
                    setNewFollowers(data.followers);
                }
            });

            socket.on('updatedFollowing', (data: any) => {
                console.log('updatedFollowing', data._id === receiverId)
                if (data._id === receiverId) {
                    if (Notification.permission === 'granted') {
                        new Notification('Notification', {
                            body: `${data.username} has started following you`,
                            icon: `${data.profilePicture ? data.profilePicture : '/profile-circle.svg'}`
                        })
                    }
                    setNewFollowing(data.following);
                }
            });
        });

        return () => {
            socket.off('updatedFollowers');
            socket.off('updatedFollowing');
        }
    }, [socket]);

    // Function to handle follow requests
    const handleFollowRequest = async () => {
        try {
            setIsLoading(true);

            if (isPrivate) {
                await axios.post('/api/socket/followRequest', { senderId: senderId, receiverId: receiverId });
            } else {
                await axios.post('/api/socket/Following', { senderId: senderId, receiverId: receiverId });
            }

            setIsLoading(false);
        } catch (error: any) {

            console.log(error)
            throw new Error(error);
        }
    };

    // Function to handle unfollow modal
    const handleUnFollowModel = () => {
        if (!isOpenUnFollow) {
            onOpenUnFollow();
            setUnFollowUserId(receiverId);
            setSenderId(senderId)
        }
    }

    const handleCancelRequest = async () => {
        try {
            setIsCancelLoading(true);

            await axios.post('/api/socket/cancelFollowRequest', { senderId: senderId, receiverId: receiverId });

            setIsCancelLoading(false);
            setIsSenderConfirmOrRejected(false)
        } catch (error: any) {

            console.log(error);
            throw new Error(error);
        }
    }

    const handleConfirmRequest = async () => {
        try {
            setIsConfirmLoading(true);

            await axios.post('/api/socket/confirmFollowRequest', { senderId: senderId, receiverId: receiverId });
            console.log('request is confirm')
            setIsConfirmLoading(false);

        } catch (error: any) {
            console.log(error)
            throw new Error(error)
        }
    }

    return (
        <>
            {isSenderConfirmOrRejected &&
                <div className={` flex justify-center gap-2  items-center `}>
                    <button className='px-[8px] py-[4px] text-[14px] rounded-md bg-[#2f8bfc] text-white  font-semibold border-none outline-none'
                        onClick={handleConfirmRequest}
                    >
                        {isConfirmLoading
                            ? 'Loading..'
                            : 'Confirm'
                        }

                    </button>
                    <button className={` px-2 py-1 text-sm dark:bg-neutral-900  text-neutral-600 font-semibold rounded-lg outline-none border-none`}
                        onClick={handleCancelRequest}
                    >
                        {isCancelLoading
                            ? <ClipLoader color='#525151' size={14} loading={true} />
                            : <FaTimes />
                        }
                    </button>

                </div>
            }
            {!isSenderConfirmOrRejected &&
                (isFollowers ?
                    <button
                        onClick={handleUnFollowModel}
                        className='px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-black dark:text-white text-sm font-semibold border-none outline-none rounded-lg'>
                        Following
                    </button >
                    :
                    <button
                        onClick={handleFollowRequest}
                        className={`px-4 py-1 ${isRequested ? 'bg-neutral-900' : 'bg-[#2f8bfc]'} text-white text-sm font-semibold border-none outline-none rounded-lg`}>
                        {isLoading
                            ? 'Loading...'
                            : (
                                isRequested ? 'Requested' : (isFollowing ? 'Follow Back' : 'Follow')
                            )
                        }
                    </button>
                )}
        </>
    )
}

export default NotificationFollowRequesteButton