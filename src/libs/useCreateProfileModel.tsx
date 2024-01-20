import { create } from "zustand";

interface CreateProfileModel {
    //   theme: "light" | "dark";
    //   toggleTheme: () => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateProfile = create<CreateProfileModel>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))