import { ImageType } from '@/components/ModelProvider';
import { IPostDataProps } from '@/components/PostsTab';
import { create } from 'zustand';

type ReactArrorSetterFn<T> = T | ((prev: T) => T)

interface IUsePostCard {
    like: boolean;
    isPinned: boolean,
    setLike: (like: boolean) => void;
    setIsPinned: (isPinned: boolean) => void;
    isPostCard: boolean;
    onPostCardOpen: () => void;
    onPostCardClose: () => void;
    postData: IPostDataProps | null;
    setPostData: (newPostObjectorSetterFn: ReactArrorSetterFn<IPostDataProps>) => void;
    postCardPostMedia: ImageType[];
    setPostCardPostMedia: (newMediaArrorSetterFn: ReactArrorSetterFn<ImageType[]>) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    textAreaInput: string;
    setTextAreaInput: (input: string) => void;
    textAreaInputLength: number;
    setTextAreaInputLength: (input: number) => void;
    showTools: boolean;
    setShowTools: (show: boolean) => void;

}

export const usePostCard = create<IUsePostCard>((set) => ({
    like: false,
    setLike: (like: boolean) => set({ like: like }),
    isPinned: false,
    setIsPinned: (isPinned: boolean) => set({ isPinned: isPinned }),
    isPostCard: false,
    onPostCardClose: () => set({ isPostCard: false }),
    onPostCardOpen: () => set({ isPostCard: true }),
    postData: null,
    setPostData: (newPostObjectorSetterFn) => {
        set((state) => {
            if (typeof newPostObjectorSetterFn === 'function') {
                return { postData: newPostObjectorSetterFn(state.postData!) };
            } else {
                return { postData: newPostObjectorSetterFn };
            }
        });
    },
    postCardPostMedia: [],
    setPostCardPostMedia: (newMediaArrOrSetterFn) => {
        set(({ postCardPostMedia }) => {
            if (Array.isArray(newMediaArrOrSetterFn)) {
                const newArr = newMediaArrOrSetterFn;
                return { selectedPostCardImage: newArr }
            }
            const setterFn = newMediaArrOrSetterFn;
            return {
                postCardPostMedia: setterFn(postCardPostMedia)
            }
        })
    },
    currentIndex: 0,
    setCurrentIndex: (index: number) => set({ currentIndex: index }),
    textAreaInput: '',
    setTextAreaInput: (input: string) => set({ textAreaInput: input }),
    textAreaInputLength: 0,
    setTextAreaInputLength: (input: number) => set({ textAreaInputLength: input }),
    showTools: true,
    setShowTools: (show) => set({ showTools: show }),
}))