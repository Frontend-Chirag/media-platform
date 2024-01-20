import { create } from 'zustand';

type IUseAccessTokenModel = {
    tokenState: boolean;
    setTokenState: (tokenState: boolean) => void;
}

export const useAccessTokenModel = create<IUseAccessTokenModel>((set) => ({
    tokenState: false,
    setTokenState: (tokenState: boolean) => set({ tokenState })
}))