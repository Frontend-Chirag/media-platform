import { create } from 'zustand';

type IUnFollowType = {
    unFollowUserId: string | string[] | undefined;
    setUnFollowUserId: (id: string | string[] | undefined) => void;
    senderId: string | undefined;
    setSenderId: (id: string | undefined) => void;
    isOpenUnFollow: boolean;
    onOpenUnFollow: () => void;
    onCloseUnFollow: () => void;
}

export const useUnFollow = create<IUnFollowType>((set) => ({
    unFollowUserId: '',
    setUnFollowUserId: (id: string | string[] | undefined) => set({ unFollowUserId: id }),
    senderId: '',
    setSenderId: (id: string | undefined) => set({ senderId: id }),
    isOpenUnFollow: false,
    onOpenUnFollow: () => set({ isOpenUnFollow: true }),
    onCloseUnFollow: () => set({ isOpenUnFollow: false })
}))