import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types';
import { User } from '@/Schemas/userSchema';
import { Notification } from '@/Schemas/notificationSchema';
import { getUserByID } from '@/utils/userFunction';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        // Extract the 'userId' from the query parameters
        const { userId } = req.query;

        // Aggregate pipeline to fetch notification data for a specific user
        const notifyPepline = await User.aggregate([
            {
                $match: {
                    name: `${userId}`
                }
            },
            {
                $lookup: {
                    from: "notifications",
                    localField: "_id",
                    foreignField: "userTo",
                    as: "notificationData"
                }
            },
            {
                $unwind: "$notificationData"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "notificationData.userFrom",
                    foreignField: "_id",
                    as: "senderUser"
                }
            },
            {
                $project: {
                    notificationData: 1,
                    senderUser: {
                        username: 1,
                        profilePicture: 1,
                        _id: 1,
                        friendRequests: 1,
                        followers: 1,
                        following: 1,
                        isPrivate: 1,
                    }
                }
            },
            {
                $sort: {
                    'notificationData.createdAt': -1
                }
            }
        ]);

        // Return the fetched notification data with a 201 status code
        return res.status(201).json({ notify: notifyPepline });

    } catch (error) {
        console.log(error);
        // Return a 500 status code for internal server error with a message
        return res.status(500).json({ message: 'Failed to send Notification to the user' });
    }
}
