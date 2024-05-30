import { create } from 'zustand';


interface IUseMobileSettingModelProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};


export const useMoblieSettingModel = create<IUseMobileSettingModelProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))