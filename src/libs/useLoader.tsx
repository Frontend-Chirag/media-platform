import { create } from 'zustand';

interface IUseLoader {
    isloader: boolean;
    setIsLoader: (isLoader: boolean) => void;
};

export const useLoader = create<IUseLoader>((set) => ({
    isloader: false,
    setIsLoader: (isLoader: boolean) => set({ isloader: isLoader })
}))


