import { ImageType } from '@/components/ModelProvider';
import { create } from 'zustand';

type ReactArrOrSetterFn<T> = T | ((prev: T) => T)

interface IUsePostCropper {
    imageUrl: string;
    setImageUrl: (url: string) => void;
    isCropper: boolean;
    onCropperOpen: () => void;
    onCropperClose: () => void;
    index: number;
    setIndex: (index: number) => void;
    cropperMedia: ImageType[];
    setCropperMedia: (newArrOrSetterFn: ReactArrOrSetterFn<ImageType[]>) => void
};

export const usePostCropper = create<IUsePostCropper>((set) => ({
    imageUrl: '',
    setImageUrl: (url: string) => set({ imageUrl: url }),
    isCropper: false,
    onCropperOpen: () => set({ isCropper: true }),
    onCropperClose: () => set({ isCropper: false }),
    index: 0,
    setIndex: (index: number) => set({ index: index }),
    cropperMedia: [],
    setCropperMedia: (newArrOrSetterFn) => {
        set(({ cropperMedia }) => {
            if (Array.isArray(newArrOrSetterFn)) {
                const newArr = newArrOrSetterFn;
                return {
                    selectedArrMedia: newArr
                }
            }
            const setterFn = newArrOrSetterFn;
            return {
                cropperMedia: setterFn(cropperMedia)
            }
        })
    }
}))