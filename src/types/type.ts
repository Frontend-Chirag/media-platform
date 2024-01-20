
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
    receiverId: string;
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

}

export type IConfirmRequestProps = {
    friendRequests: FriendRequestStatus[];
    receiverId: string[] | string;
    senderId: string;
    notification: 'notify' | 'profile';
    isSenderConfirmOrRejected: Boolean;
    setIsSenderConfirmOrRejected: (isSenderConfirmOrRejected: Boolean) => void
};


