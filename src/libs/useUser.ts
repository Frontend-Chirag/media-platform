
import { IUserProps } from '@/types/type';
import { create } from 'zustand';

type ReactUserDataOrSetterFn<T> = T | ((prev: T) => T)

interface State {
    user: IUserProps | null;
    setUser: (userDataOrSetterFn: ReactUserDataOrSetterFn<IUserProps>) => void;
};

export const useUser = create<State>((set) => ({
    user: null,
    setUser: (userDataOrSetterFn) => {
        set(({user}) => {
            if (typeof userDataOrSetterFn === 'function') {
                const setterFn = userDataOrSetterFn;
                return { user: setterFn(user!) }
            }
            return { user: userDataOrSetterFn }
        })
    },
}));