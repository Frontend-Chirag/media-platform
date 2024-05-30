import { create } from 'zustand';

interface IUseNewMessageUserSearch {
    isNewMessageUserSearch: boolean;
    onNewMessageUserSearchOpen: () => void;
    onNewMessageUserSearchClose: () => void;
    conversationId: string;
    setConversationId: (conversationId: string) => void;
    type: 'Conversation' | 'ConversationId',
    setType: (type: 'Conversation' | 'ConversationId') => void
};

export const useNewMessageUserSearch = create<IUseNewMessageUserSearch>((set) => ({
    isNewMessageUserSearch: false,
    onNewMessageUserSearchClose: () => set({ isNewMessageUserSearch: false }),
    onNewMessageUserSearchOpen: () => set({ isNewMessageUserSearch: true }),
    conversationId: '',
    setConversationId: (conversationId) => set({ conversationId: conversationId }),
    type: 'Conversation',
    setType: (type) => set({type: type})
}))