import { User } from '@/Schemas/userSchema';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the request body
        const reqBody = req.body;

        // Extract the 'id' from the request body
        const { id } = reqBody;

        // Find the user by ID and exclude sensitive information (password, refreshToken)
        const user = await User.findById(id).select('-password -refreshToken');

        // If user not found, return a 401 status code with a message
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Toggle the 'isPrivate' property of the user
        user.isPrivate = !user.isPrivate;

        // Save the updated user
        await user.save();

        // Emit a 'switchAccount' event to the user's socket room
        res?.socket?.server?.io?.to(`${user._id}`).emit('switchAccount', user);

        // Return a success message with a 200 status code
        return res.status(200).json({ message: 'Switch Account successfully' });
    } catch (error) {
        console.log(error);
        // Return a 500 status code for internal server error with a message
        return res.status(500).json({ message: 'Failed to Switch Account' });
    }
}
