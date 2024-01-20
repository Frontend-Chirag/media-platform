import { MutableRefObject } from "react";
import { create } from "zustand";


interface uploadModel {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    inputRef: MutableRefObject<HTMLInputElement | null> | null;
    setInputRef: (ref: MutableRefObject<HTMLInputElement | null>) => void;
}

export const useUploadModel = create<uploadModel>((set) => ({
    isOpen: false,
    inputRef: null,
    setInputRef: (ref) => set({ inputRef: ref }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))