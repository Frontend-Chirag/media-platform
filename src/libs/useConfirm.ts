import {create} from 'zustand';

interface IUseConfirmOrRejected  {
    isSenderConfirmOrRejected: Boolean;
    setIsSenderConfirmOrRejected: (IsSenderConfirmOrRejected: Boolean) => void
}

export const useConfirmOrRejected = create<IUseConfirmOrRejected>((set) => ({
    isSenderConfirmOrRejected: false,
    setIsSenderConfirmOrRejected: (IsSenderConfirmOrRejected: Boolean) => set({isSenderConfirmOrRejected: IsSenderConfirmOrRejected})
}))