import { create } from 'zustand';

interface INotificationProp {
    isNotification: Boolean;
    onNotificationOpen: () => void;
    onNotificationClose: () => void;
}

export const useNotificationModel = create<INotificationProp>((set) => ({
    isNotification: false,
    onNotificationOpen: () => set({ isNotification: true }),
    onNotificationClose: () => set({ isNotification: false }),
}))