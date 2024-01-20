import { User } from '@/Schemas/userSchema';
import { NextApiResponseServerIo } from '../../../types';

import { NextApiRequest } from 'next';


// This is the handler for the follow request API endpoint
export default async function handler(request: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = request.body;

        // Extract senderId and receiverId from the request body
        const { senderId, receiverId } = reqBody;

        // If either senderId or reciverId is Missing , return an error
        if (!senderId && !receiverId) {
            return res.status(401).json({ message: 'Id not found' });
        }

        // Find receiver User and remove the pending request from their friendRequests field
        const updatedReceiverUser = await User.findOneAndUpdate(
            { _id: senderId },
            { $pull: { friendRequests: { senderId: receiverId, status: 'pending' } } },
            { new: true }
        ).select('-password -refreshToken -email');

        // Find sender User and remove the pending request from their friendRequests field
        const updatedSenderUser = await User.findOneAndUpdate(
            { _id: receiverId },
            { $pull: { friendRequests: { receiverId: senderId, status: 'pending' } } },
            { new: true }
        ).select('-password -refreshToken -email');

        // Emit a 'followRequest' event to the sender's client with the updated receiver user
        res?.socket?.server?.io?.to(`${updatedSenderUser._id}`)?.emit('followRequest', {
            receiverUser: updatedReceiverUser,
        });

        // Emit a 'confirmRequest' event to the receiver's client with the updated sender user
        res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit('confirmRequest', {
            senderUser: updatedSenderUser,
        });

        return res.status(200).json({ message: 'Follow Request Canceled Successfully' });
    } catch (error: any) {

        if (error.name === 'MongoError') {
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(500).json({ message: 'Failed to canceled Folloq Request' });
    }
};

