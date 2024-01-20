import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types';
import { User } from '@/Schemas/userSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = req.body;

        // Extract senderId and receiverId from the request body
        const { senderId, receiverId } = reqBody;

        // Update receiver user by adding senderId to their following list
        const updatedReceiverUser = await User.findOneAndUpdate(
            { _id: senderId },
            {
                $addToSet: { following: receiverId },
            },
            { new: true }
        ).select('-password -refreshToken -email');

        // If receiver user not found, return a 401 status code
        if (!updatedReceiverUser) {
            return res.status(401).json({ message: 'ReceiverUser not found' });
        }

        // Update sender user by adding receiverId to their followers list
        const updatedSenderUser = await User.findOneAndUpdate(
            { _id: receiverId },
            {
                $addToSet: { followers: senderId },
            },
            { new: true }
        ).select('-password -refreshToken -email');

        // If sender user not found, return a 401 status code
        if (!updatedSenderUser) {
            return res.status(401).json({ message: 'SenderUser not found' });
        }

        // Emit 'updatedFollowers' and 'updatedFollowing' events to update follower and following counts
        res?.socket?.server?.io?.to(`${updatedReceiverUser._id}`)?.emit("updatedFollowers", updatedSenderUser);
        res?.socket?.server?.io?.to(`${updatedSenderUser._id}`)?.emit("updatedFollowing", updatedReceiverUser);

        // Return a success message with a 200 status code
        return res.status(200).json({ message: 'Following User' });
    } catch (error) {
        // Log the error and return a 500 status code with an error message
        console.log(error);
        res.status(500).json({ message: 'Failed to follow user' });
    }
}
