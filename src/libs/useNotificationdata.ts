import { FriendRequestStatus } from '@/types/type';
import { create } from 'zustand';


interface NotificationData {
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

interface SenderUserData {
    _id: string;
    username: string;
    profilePicture: string;
    followers: string[];
    following: string[];
    isPrivate: boolean;
    friendRequests: FriendRequestStatus[];
}

interface SendNotification {
    _id: string;
    notificationData: NotificationData;
    senderUser: SenderUserData[];
}

interface INotificationdata {
    notificationData: SendNotification[]
    setNotificationData: (notificationData: SendNotification[]) => void;
    NotificationLoading: Boolean;
    isNotificationLoading: () => void;
    onNotificationLoaded: () => void;
};

export const useNotificationData = create<INotificationdata>((set) => ({
    notificationData: [],
    setNotificationData: (notificationData: SendNotification[]) => set({ notificationData }),
    NotificationLoading: false,
    isNotificationLoading: () => set({ NotificationLoading: true }),
    onNotificationLoaded: () => set({ NotificationLoading: false })

}))






