import { create } from 'zustand';

export interface IUseDob {
    date: string | undefined,
    month: string | undefined,
    year: string | undefined
}

export interface IUseEditFormData {
    profilePicture: string | undefined,
    backgroundImage: string | undefined,
    bio: string | undefined,
    location: string | undefined,
    name: string | undefined,
    link: string | undefined,
    dob: IUseDob | undefined,
    profession: string | undefined,
}

interface IUseEditModel {
    isEditProfile: boolean;
    setIsEditProfile: (value: boolean) => void;
    editFromData: IUseEditFormData | null;
    setEditFromData: (value: IUseEditFormData | null) => void;
}

export const useEditModel = create<IUseEditModel>((set) => ({
    isEditProfile: false,
    setIsEditProfile: (value) => set({ isEditProfile: value }),
    editFromData: null,
    setEditFromData: (value) => set({ editFromData: value })
}))