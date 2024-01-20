import { create } from "zustand";

interface ILoadingProps {
    loading: boolean;
    IsSetLoading: () => void;
    onSetLoading: () => void;
}

export const useLoading = create<ILoadingProps>((set) => ({
    loading: false,
    IsSetLoading: () => set({ loading: true }),
    onSetLoading: () => set({ loading: false })
}))