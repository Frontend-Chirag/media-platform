
import { create } from "zustand";

interface IUsePrivacyModel {
    isPrivacyOpen: boolean;
    onPrivacyOpen: () => void;
    onPrivacyClose: () => void;
    switchPrivacy: 'Public' | 'Private';
    switchtoPublic: (switchPrivacy: 'Public') => void;
    swichtoPrivate: (switchPrivacy: 'Private') => void;
};

export const usePrivacyModel = create<IUsePrivacyModel>((set) => ({
    isPrivacyOpen: false,
    switchPrivacy:'Public',
    onPrivacyClose: () => set({ isPrivacyOpen: false }),
    onPrivacyOpen: () => set({ isPrivacyOpen: true }),
    switchtoPublic: (switchPrivacy) => set({switchPrivacy}),
    swichtoPrivate: (switchPrivacy) => set({switchPrivacy})
    
})) 