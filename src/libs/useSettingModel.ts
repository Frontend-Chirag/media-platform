import { create } from "zustand";

interface SettingModel {
    //   theme: "light" | "dark";
    //   toggleTheme: () => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useSettingModel = create<SettingModel>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))