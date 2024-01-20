"use client";

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { useSocket } from '@/contexts/socket-provider';
import { useUnFollow } from '@/libs/useUnFollow';
import { IFollowButton } from '@/types/type';




const FollowButton: React.FC<IFollowButton> = ({ isPrivate, friendRequests, senderId, receiverId, followers, following }) => {

    const { socket } = useSocket();
    const { isOpenUnFollow, onOpenUnFollow, setUnFollowUserId, setSenderId } = useUnFollow();

    const [isLoading, setIsLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isFollowers, setIsFollowers] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const [receiverRequests, setReceiverRequests] = useState(friendRequests);
    const [newfollowers, setNewFollowers] = useState(followers);
    const [newfollowing, setNewFollowing] = useState(following)

    // Effect to check if the sender is already following the receiver
    useEffect(() => {
        if (Array.isArray(newfollowers) && Array.isArray(newfollowing)) {

            const isFindingFollowers = newfollowers.some((followerId) =>
                followerId === senderId
            );

            const isFindingFollowing = newfollowing.some((followingId) =>
                followingId === senderId
            );

            setIsFollowing(isFindingFollowing);
            setIsFollowers(isFindingFollowers)
        }

    }, [newfollowers, newfollowing, senderId]);

    // Effect to check if a follow request has been sent
    useEffect(() => {
        if (Array.isArray(receiverRequests)) {
            const isRequestedSent = receiverRequests.some((request) =>
                request.senderId === senderId && request.status === 'pending'
            );
            console.log('isRequestedSent', isRequestedSent)
            setIsRequested(isRequestedSent);
        }
    }, [receiverRequests]);

    // Effect to Listen for 'followRequest' events from the socket
    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            socket.on('followRequest', (data: any) => {
                if (data.receiverUser._id === receiverId) {
                    console.log('receiverUser', data.receiverUser._id === receiverId)
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
                if (data._id === receiverId) {
                    setNewFollowers(data.followers);
                }
            });

            socket.on('updatedFollowing', (data: any) => {
                if (data._id === receiverId) {
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
                await axios.post('/api/socket/followRequest', { senderId: senderId, receiverId: receiverId })

            } else {
                await axios.post('/api/socket/Following', { senderId: senderId, receiverId: receiverId })
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
                        : (
                            (isRequested ? 'Requested' : (isFollowing ? 'Follow Back' : 'Follow'))
                        )
                    }
                </button>
            }

        </div>
    )
}

export default FollowButton