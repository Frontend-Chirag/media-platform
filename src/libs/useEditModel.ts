import { create } from 'zustand';

interface EditModel {
    imageUrl: string;
    setImageUrl: (imageUrl: string) => void;
};

export const useEditModel = create<EditModel>((set) => ({
    imageUrl: '',
    setImageUrl: (imageUrl: string) => set({ imageUrl: imageUrl })
}));

interface NameAndUsernameModel {
    value: 'name' | 'username' | 'bio';
    setValue: (value: 'name' | 'username' | 'bio') => void;
    IsOpenNameAndUsername: boolean;
    onOpenNameAndUsername: () => void;
    onCloseNameAndUsername: () => void;
}

export const useNameAndUsernameModel = create<NameAndUsernameModel>((set) => ({
    value: 'name',
    setValue: (value: 'name' | 'username' | 'bio') => set({ value: value }),
    IsOpenNameAndUsername: false,
    onOpenNameAndUsername: () => set({ IsOpenNameAndUsername: true }),
    onCloseNameAndUsername: () => set({ IsOpenNameAndUsername: false }),
}))
