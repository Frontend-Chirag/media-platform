"use server";
import { NextRequest, NextResponse } from 'next/server';
import { User } from "@/Schemas/userSchema";
import { getUserByCookies } from './getUserByCookies';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { request } from 'http';


export const getAllUsers = async () => {
    try {
        const allusers = await User.find({}).select('-password -refreshToken')

        if (!allusers) {
            throw new Error('Users not found');
        }

        return allusers;

    } catch (error) {
        console.log(error);
        throw new Error('Failed to get all users')
    }
}

export const sendFollowRequestNotification = async (name: string) => {
    try {

        const sendNotification = await User.aggregate([
            {
                $match: {
                    name: `${name}`
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

        const newNotification = sendNotification[0]

        return { newNotification };
    } catch (error) {
        console.log(error);
        throw new Error;
    }
}

export const getUserByID = async (id: string) => {
    try {

        await ConnectedToDatabase();

        const users = await User.findOne({ _id: id }).select('-password -refreshToken -email ');

        if (!users) {
            throw new Error('User not found');
        }

        return users;

    } catch (error) {
        console.log(error);
        throw new Error('Failed to get all users by id')
    }
}


