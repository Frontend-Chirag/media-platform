import { SetStateAction } from "react";

export type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

export interface MailerProps {
    email: string;
    emailType: string;
    forgotPasswordToken?: string;
    verificationToken?: string;
}


export type FriendRequestStatus = {
    receiverId: string;
    senderId: string;
    status: 'pending' | 'accepted' | 'rejected';
};

export type IUserProps = {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    profilePicture: string;
    backgroundImage: string;
    profession: string;
    location: string;
    link: string;
    dob: {
        date: string,
        month: string,
        year: string
    };
    gender: string;
    followers: string[];
    following: string[];
    friendRequests: FriendRequestStatus[];
    posts: string[]
    savedPosts: string[];
    likedPosts: string[];
    comments: string[];
    notifications: string[];
    type: string;
    messages: string[];
    blockedUsers: string[];
    isOnline: boolean;
    lastSeen: string;
    isPrivate: boolean;
    isVerified: boolean;
}

export type NotificationData = {
    _id: string;
    userTo: string;
    userFrom: string;
    entityId: string;
    notificationType: string;
    notificationMessage: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export type SenderUserData = {
    _id: string;
    username: string;
    profilePicture: string;
    followers: string[];
    following: string[];
    isPrivate: boolean;
    friendRequests: FriendRequestStatus[];
}

export type SendNotification = {
    _id: string;
    notificationData: NotificationData;
    senderUser: SenderUserData[];
}

export type IUsersContainerProps = {
    receiverId: string | undefined;
    senderId: string | undefined;
    username: string;
    profilePicture: string;
    friendRequests: FriendRequestStatus[];
    followers: string[];
    following: string[];
    isPrivate: boolean;
}

export type IFollowButton = {
    receiverId: string[] | string | undefined;
    senderId: string | undefined;
    friendRequests: FriendRequestStatus[] | FriendRequestStatus | undefined;
    followers: string[] | string | undefined;
    following: string[] | string | undefined;
    isPrivate: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<SetStateAction<boolean>>;
    isRequested: boolean;
    setIsRequested: React.Dispatch<SetStateAction<boolean>>;
    isFollowers: boolean;
    setIsFollowers: React.Dispatch<SetStateAction<boolean>>;
    isFollowing: boolean;
    setIsFollowing: React.Dispatch<SetStateAction<boolean>>;
}

export type IFollowButtonSuggestion = {
    receiverId: string | undefined;
    senderId: string | undefined;
    friendRequests: FriendRequestStatus[];
    followers: string[];
    following: string[];
    isPrivate: boolean;
}

export type INotificationFollowRequestButtonProps = {
    receiverId: string | undefined;
    senderId: string;
    friendRequests: FriendRequestStatus[];
    followers: string[] | string | undefined;
    following: string[] | string | undefined;
    isPrivate: boolean;
}

export type IConfirmRequestProps = {
    friendRequests: FriendRequestStatus[];
    receiverId: string | undefined;
    senderId: string;
};


export interface Song {
    id: string;
    user_id: string;
    author: string;
    title: string;
    song_path: string;
    image_path: string;
}

