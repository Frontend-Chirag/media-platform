import { NextApiResponseServerIo } from '@/types';
import { NextApiRequest } from 'next';

import { User } from '@/Schemas/userSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = req.body;

        // Extract the 'unFollowUserId' and 'senderId' from the request body
        const { unFollowUserId, senderId } = reqBody;

        // Find and update the user to be unfollowed, removing the sender from their followers
        const unFollowUser = await User.findByIdAndUpdate(
            { _id: unFollowUserId },
            { $pull: { followers: senderId } },
            { new: true }
        ).select('-password -refreshToken -email');

        // Find and update the sender user, removing the unfollowed user from their following
        const senderUser = await User.findByIdAndUpdate(
            { _id: senderId },
            { $pull: { following: unFollowUserId } },
            { new: true }
        ).select('-password -refreshToken -email');

        // If either user is not found, return a 401 status code with a message
        if (!(unFollowUser && senderUser)) {
            res?.status(401).json({ message: 'User not found' });
        }

        // Emit 'updatedFollowing' event to the unfollowed user's socket room
        res?.socket?.server?.io?.to(`${unFollowUser._id}`).emit('updatedFollowing', senderUser);

        // Emit 'updatedFollowers' event to the sender's socket room
        res?.socket?.server?.io?.to(`${senderUser._id}`).emit('updatedFollowers', unFollowUser);

        console.log('Unfollow user');

        // Return a success message with a 200 status code
        res?.status(200).json({ message: 'Unfollow user successfully' });
    } catch (error) {
        console.log(error);
        // Return a 500 status code for internal server error with a message
        res?.status(500).json({ message: 'Failed to Unfollow user' });
    }
}
