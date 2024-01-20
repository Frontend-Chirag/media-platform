import { create } from 'zustand';

interface IUseFollowProps {
    isLoading: Boolean;
    setIsLoading: (isLoading: Boolean) => void;
    isRequested: Boolean
    setIsRequested: (isRequested: Boolean) => void;
    isFollowers: Boolean
    setIsFollowers: (isFollowers: Boolean) => void;
    isFollowing: Boolean
    setIsFollowing: (isFollowing: Boolean) => void;
};

export const useFollowState = create<IUseFollowProps>((set) => ({
    isLoading: false,
    setIsLoading: (isLoading: Boolean) => set({ isLoading: isLoading }),
    isRequested: false,
    setIsRequested: (isRequested: Boolean) => set({ isRequested: isRequested }),
    isFollowers: false,
    setIsFollowers: (isFollowers: Boolean) => set({ isFollowers: isFollowers }),
    isFollowing: false,
    setIsFollowing: (isFollowing: Boolean) => set({ isFollowing: isFollowing }),
}))