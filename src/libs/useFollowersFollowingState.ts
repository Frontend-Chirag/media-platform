import {create} from 'zustand';

interface FollowersFollowingState  {
  updatedfollowers: string[] | undefined ;
  updatedfollowing: string[]  | undefined ;
  setUpdatedFollowers: (updatedfollowers: string[] ) => void;
  setUpdatedFollowing: (updatedfollowing: string[] ) => void;
};

export const useFollowersFollowingState = create<FollowersFollowingState>((set) => ({
    updatedfollowers: [],
    updatedfollowing: [],
    setUpdatedFollowers: (updatedfollowers) => set({updatedfollowers}),
    setUpdatedFollowing: (updatedfollowing) => set({updatedfollowing}),
}));