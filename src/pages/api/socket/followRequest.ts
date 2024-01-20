import { NextApiRequest } from 'next';
import { User } from '@/Schemas/userSchema';
import { NextApiResponseServerIo } from '../../../types';
import { Notification } from '@/Schemas/notificationSchema';

// This is the handler for the follow request API endpoint
export default async function handler(request: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = request.body;

        // Extract senderId and receiverId from the request body
        const { senderId, receiverId } = reqBody;

        // Fetch the receiver and sender user from the database
        const receiverUser = await User.findOne({ _id: receiverId });
        const senderUser = await User.findOne({ _id: senderId });

        // If either user is not found, return a 401 status code
        if (!receiverUser || !senderUser) {
            return res.status(401).json({ message: 'Users not found' });
        }

        // Check if the sender has already sent a follow request to the receiver
        const alreadySent = receiverUser.friendRequests?.some((request: any) =>
            request.senderId.toString() === senderId && request.status === 'pending'
        );

        // If a follow request has already been sent, cancel it
        if (alreadySent) {
            // Remove the request from the receiver's friendRequest field
            const updatedReceiverUser = await User.findOneAndUpdate(
                { _id: receiverId },
                { $pull: { friendRequests: { senderId: senderId, status: 'pending' } } },
                { new: true }
            ).select('-password -refreshToken -email');

            // Remove the follow request from the sender's friendRequests field
            const updatedSenderUser = await User.findOneAndUpdate(
                { _id: senderId },
                { $pull: { friendRequests: { receiverId: receiverId, status: 'pending' } } },
                { new: true }
            ).select('-password -refreshToken -email');

            // Delete the follow request notification
            await Notification.deleteOne({
                userFrom: updatedSenderUser._id,
                userTo: updatedReceiverUser._id,
                notificationType: 'follow',
            });

            // Emit events to update UI in real-time
            res?.socket?.server?.io?.to(`${updatedSenderUser._id}`)?.emit('followRequest', {
                receiverUser: updatedReceiverUser,
            });

            res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit('confirmRequest', {
                senderUser: updatedSenderUser,
            });

            res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit('sendFollowRequestNotification', {
                newNotification: false,
            });

            console.log('Follow Request canceled');
        } else {
            // If a follow request has not been sent, send one

            // Create a follow request notification
            await Notification.create({
                userTo: receiverId,
                userFrom: senderId,
                entityId: senderId,
                notificationType: 'follow',
                notificationMessage: 'sent you a follow request',
            });

            // Add the follow request to the receiver's friendRequests field
            const updatedReceiverUser = await User.findOneAndUpdate(
                { _id: receiverId },
                {
                    $addToSet: {
                        friendRequests: { senderId: senderId, status: 'pending' },
                    },
                },
                { new: true }
            ).select('-password -refreshToken -email');

            // Add the follow request to the sender's friendRequests field
            const updatedSenderUser = await User.findOneAndUpdate(
                { _id: senderId },
                {
                    $addToSet: {
                        friendRequests: { receiverId: receiverId, status: 'pending' },
                    },
                },
                { new: true }
            ).select('-password -refreshToken -email');

            // Emit events to update UI in real-time
            res?.socket?.server?.io?.to(`${updatedSenderUser._id}`)?.emit('followRequest', {
                receiverUser: updatedReceiverUser,
            });

            res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit('confirmRequest', {
                senderUser: updatedSenderUser,
            });

            res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit('sendFollowRequestNotification', {
                newNotification: true,
            });

            console.log('Follow Request sent');
        }

        // Return a success message with a 200 status code
        return res.status(200).json({ message: 'Follow Request sent Successfully' });
    } catch (error: any) {
        // Handle errors and return appropriate status codes
        if (error.name === 'MongoError') {
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(500).json({ message: 'Failed to send follow request' });
    }
};
