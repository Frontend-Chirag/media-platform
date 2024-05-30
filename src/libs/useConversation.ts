import { create } from 'zustand';

interface IUseConverstion {
    isConversationOpen: boolean,
    setIsConversationOpen: (isConversationOpen: boolean) => void,
}

export const useConveration = create<IUseConverstion>((set) => ({
    isConversationOpen: false,
    setIsConversationOpen: (isConversationOpen) => set({ isConversationOpen: isConversationOpen })
}))