import { ImageType } from '@/components/ModelProvider';
import { create } from 'zustand';

export interface IUseReplyToData {
    username: string,
    userId: string
}
interface postData {
    name: string,
    username: string,
    caption: string,
    profilePicture: string,
}

type ReactArrOrSetterFn<T> = T | ((prev: T) => T)

interface IUseReplyProps {
    isReply: boolean,
    onReplyOpen: () => void;
    onReplyClose: () => void;
    replyToData: IUseReplyToData | IUseReplyToData[] | null;
    postReplyId: string;
    postData: postData | undefined;
    setPostData: (data: postData) => void;
    setPostReplyId: (postReplyId: string) => void;
    setReplyToData: (replyToData: IUseReplyToData | IUseReplyToData[]) => void;
    parentPostIds: string | string[];
    setParentPostIds: (ids: string | string[]) => void;
    replyMedia: ImageType[];
    setReplyMedia: (newReplyMediaArrOrSetter: ReactArrOrSetterFn<ImageType[]>) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    showTools: boolean;
    setShowTools: (show: boolean) => void;
    textAreaInput: string;
    setTextAreaInput: (input: string) => void;
    textAreaInputLength: number;
    setTextAreaInputLength: (input: number) => void;
};

export const useReply = create<IUseReplyProps>((set) => ({
    isReply: false,
    onReplyOpen: () => set({ isReply: true }),
    onReplyClose: () => set({ isReply: false }),
    replyToData: null,
    postData: undefined,
    setPostData: (data) => set({ postData: data }),
    setReplyToData: (replyToData: IUseReplyToData | IUseReplyToData[]) => set({ replyToData: replyToData }),
    postReplyId: '',
    setPostReplyId: (postReplyId: string) => set({ postReplyId: postReplyId }),
    parentPostIds: '',
    setParentPostIds: (postReplyId) => set({ parentPostIds: postReplyId }),
    replyMedia: [],
    setReplyMedia: (newReplyMediaArrOrSetterFn) => {
        set(({ replyMedia }) => {
            if (Array.isArray(newReplyMediaArrOrSetterFn)) {
                const newArr = newReplyMediaArrOrSetterFn;
                return { selectedImageArr: newArr }
            }
            const setterFn = newReplyMediaArrOrSetterFn;
            return {
                replyMedia: setterFn(replyMedia)
            }

        })
    },
    currentIndex: 0,
    setCurrentIndex: (index: number) => set({ currentIndex: index }),
    showTools: true,
    setShowTools: (show) => set({ showTools: show }),
    textAreaInput: '',
    setTextAreaInput: (input: string) => set({ textAreaInput: input }),
    textAreaInputLength: 0,
    setTextAreaInputLength: (input: number) => set({ textAreaInputLength: input }),

}))