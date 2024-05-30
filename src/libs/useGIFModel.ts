import { create } from 'zustand';
;


interface IUseGIFProps {
    isGIF: boolean;
    onGIFOpen: () => void;
    onGIFClose: () => void;
    gif: string[];
    setGif: (newGif: string[]) => void;
}

export const useGIF = create<IUseGIFProps>((set) => ({
    isGIF: false,
    onGIFOpen: () => set({ isGIF: true }),
    onGIFClose: () => set({ isGIF: false }),
    gif: [],
    setGif: (newGif: string[]) => set((state) => ({ gif: [...state.gif, ...newGif] })),
}))