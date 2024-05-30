"use client";

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { useSocket } from '@/contexts/socket-provider';
import { useUnFollow } from '@/libs/useUnFollow';
import { FriendRequestStatus, IFollowButton } from '@/types/type';


const FollowButton: React.FC<IFollowButton> = ({
    isPrivate,
    friendRequests,
    senderId,
    receiverId,
    followers,
    following,
    isLoading,
    setIsLoading,
    isRequested,
    setIsRequested,
    isFollowers,
    setIsFollowers,
    isFollowing,
    setIsFollowing,
}) => {

    const { socket } = useSocket();
    const { isOpenUnFollow, onOpenUnFollow, setUnFollowUserId, setSenderId } = useUnFollow();

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

    // Effect to Listen for 'followRequest' events from the socket
    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            socket.on('followRequest', (data: any) => {
                if (data.receiverUser._id === receiverId) {
                    setReceiverRequests(data.receiverUser.friendRequests);
                    console.log('emit to followButton')
                }
            });
        });

        return () => {
            socket.off('followRequest');
        }
    }, [socket, receiverId]);

    useEffect(() => {
        socket.on('connect', () => {
            socket.on('confirmRequest', (data: any) => {
                const isFollowRequestExists = data.senderUser.friendRequests.find((isExists: FriendRequestStatus) => {
                    return isExists.receiverId === senderId && isExists.status === 'pending'
                });
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
            }
        })
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
    }, [socket])

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



    return (
        <div className='flex flex-col justify-center items-center gap-2 '>
            {isFollowers ?
                <button
                    onClick={handleUnFollowModel}
                    className='px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-sm font-semibold border-none outline-none rounded-lg'>
                    Following
                </button>
                :
                <button
                    onClick={handleFollowRequest}
                    className={`px-4 py-1 ${isRequested ? 'bg-neutral-900' : 'bg-[#2f8bfc]'} text-white text-sm font-semibold border-none outline-none rounded-lg`}>
                    {isLoading
                        ? 'Loading...'
                        : (isRequested ? 'Requested' : (isFollowing ? 'Follow Back' : 'Follow'))
                    }
                </button>
            }
        </div>
    )
}

export default FollowButton