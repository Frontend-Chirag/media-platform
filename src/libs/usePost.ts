import { ImageType } from '@/components/ModelProvider';
import { create } from 'zustand';

export type ReactStyleStateSetter<T> = T | ((prev: T) => T)

interface IUsePostProps {
    isPost: boolean;
    onPostOpen: () => void;
    onPostClose: () => void;
    showTools: boolean;
    setShowTools: (show: boolean) => void;
    textAreaInput: string;
    setTextAreaInput: (input: string) => void;
    textAreaInputLength: number;
    setTextAreaInputLength:  (input: number) => void;
    media: ImageType[];
    setMedia: (newArrorSetterFn: ReactStyleStateSetter<ImageType[]>) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
};

export const usePosts = create<IUsePostProps>((set) => ({
    isPost: false,
    onPostOpen: () => set({ isPost: true }),
    onPostClose: () => set({ isPost: false }),
    showTools: true,
    setShowTools: (show) => set({ showTools: show }),
    textAreaInput: '',
    setTextAreaInput: (input: string) => set({ textAreaInput: input }),
    textAreaInputLength: 0,
    setTextAreaInputLength: (input: number) => set({ textAreaInputLength: input }),
    media: [],
    setMedia: (newArrorSetterFn) => {
        set(({ media }) => {
            if (Array.isArray(newArrorSetterFn)) {
                const newArr = newArrorSetterFn;
                return { selectedImage: newArr };
            }
            const setterFn = newArrorSetterFn;
            return {
                media: setterFn(media)
            }
        })
    },
    currentIndex: 0,
    setCurrentIndex: (index: number) => set({ currentIndex: index })
}))