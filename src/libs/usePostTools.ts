import { create } from 'zustand';

type ReactIdsorSetterFn<T> = T | ((prev: T) => T)

interface IUsePostId {
    likes: string,
    savePost: string,
    commentLength: string
}

interface IUsePostTools {
    newPostId: IUsePostId,
    setNewPostId: (newIdsOrSetterFn: ReactIdsorSetterFn<IUsePostId>) => void;
}

export const usePostTools = create<IUsePostTools>((set) => ({
    newPostId: {
        likes: '',
        savePost: '',
        commentLength: ''
    },
    setNewPostId: (newIdsOrSetterFn) => {
        set(({ newPostId }) => {
            if (typeof newIdsOrSetterFn === 'function') {
                const setterFn = newIdsOrSetterFn;
                return { newPostId: setterFn(newPostId) }
            }
            return { newPostId: newIdsOrSetterFn }
        })
    }
}))