import { NextApiRequest } from 'next';
import { User } from '@/Schemas/userSchema';
import { NextApiResponseServerIo } from '@/types';
import { Notification } from '@/Schemas/notificationSchema';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = req.body;

        // Extract senderId and receiverId from the request body
        const { senderId, receiverId } = reqBody;

        // Update receiver user by removing the pending request and adding to followers
        const updatedReceiverUser = await User.findOneAndUpdate(
            { _id: senderId },
            {
                $pull: { friendRequests: { senderId: receiverId, status: 'pending' } },
                $addToSet: { followers: receiverId },
            },
            { new: true }
        ).select('-password -refreshToken -email');

        // If receiver user not found, return a 401 status code
        if (!updatedReceiverUser) {
            return res.status(401).json({ message: 'ReceiverUser not found' })
        };

        // Update sender user by removing the pending request and adding to following
        const updatedSenderUser = await User.findOneAndUpdate(
            { _id: receiverId },
            {
                $pull: { friendRequests: { receiverId: senderId, status: 'pending' } },
                $addToSet: { following: senderId },
            },
            { new: true }
        ).select('-password -refreshToken -email');

        // If sender user not found, return a 401 status code
        if (!updatedSenderUser) {
            return res.status(401).json({ message: 'SenderUser not found' })
        };

        // Update the follow notification message
        const updatedNotification = await Notification.findOneAndUpdate(
            {
                $and: [
                    { userFrom: updatedSenderUser._id },
                    { userTo: updatedReceiverUser._id },
                    { notificationType: 'follow' }
                ]
            },
            {
                notificationMessage: 'started following you',
                notificationType: 'following'
            },
            { new: true }
        );

        console.log('Confirm Notification pipeline', updatedNotification);

        // Emit an 'updatedNotification' event to the receiver's client
        res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`).emit('updatedNotification', {
            updatedNotification: updatedNotification
        });

        // Emit a 'followRequest' event to the sender's client with the updated receiver user
        res?.socket?.server?.io?.to(`${updatedSenderUser._id}`).emit('followRequest', {
            receiverUser: updatedReceiverUser,
        });

        // Emit a 'confirmRequest' event to the receiver's client with the updated sender user
        res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`).emit('confirmRequest', {
            senderUser: updatedSenderUser,
        });

        // Emit 'updatedFollowers' and 'updatedFollowing' events to update follower and following counts
        res?.socket?.server?.io?.to(`${updatedSenderUser._id}`)?.emit("updatedFollowers", updatedReceiverUser);
        res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit("updatedFollowing", updatedSenderUser);

        // Return a success message with a 200 status code
        return res.status(200).json({ message: 'Follow Request is confirmed' });
    } catch (error) {
        // Log the error and return a 500 status code with an error message
        console.log(error);
        return res.status(500).json({ message: 'Failed to accept follow Request' });
    }
}
