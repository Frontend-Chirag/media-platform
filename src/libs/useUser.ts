
import { IUserProps } from '@/types/type';
import { create } from 'zustand';

interface State  {
    user: IUserProps | null;
    setUser: (user: IUserProps | null) => void;
};

export const useUser = create<State>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));