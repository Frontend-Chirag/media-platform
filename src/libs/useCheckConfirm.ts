import { create } from 'zustand';

interface IUseCheckConfirm {
    isCheckConfirm : boolean;
    setIsChectConfirm: (isCheckConfirm : boolean) => void;
}

export const useCheckConfirm = create<IUseCheckConfirm>((set) => ({
  isCheckConfirm: false,
  setIsChectConfirm: (isCheckConfirm: boolean) => set({isCheckConfirm: isCheckConfirm})
}))