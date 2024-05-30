import axios from 'axios';
import { Query } from 'mongoose';
import {
    useMutation,
    useQueryClient,
    useQuery,
    QueryClient,
} from '@tanstack/react-query';
import { IUseCommentNewMedia, IUseNewMedia } from '@/components/Post';
import { IUseInputEditData } from '@/components/EditProfile';
import { IUseDob } from '@/libs/useEditModel';

export enum QUERY_KEY {
    GET_USER_BY_ID = 'userById',
    GET_SUGGESTED_USER = 'suggestedUser',
    CREATE_NEW_POSTS = 'createPosts',
    GET_POSTS = 'getPosts',
    GET_POSTS_BY_ID = 'getPostById',
    GET_ALL_SAVED_POSTS = 'getAllSavedPosts',
    GET_All_POST_COMMENTS = 'getAllPostComments',
    GET_LIKES = 'getLikes',
    GET_SAVEPOSTS = 'getSavePosts',
    GET_COMMENTS_LENGTH = 'getCommentsLength',
    GET_COMMENTS_LIKES = 'getCommentsLikes',
    GET_COMMENTS_SAVEPOSTS = 'getCommentsSavePosts',
    GET_COMMENTS_COMMENTS_LENGTH = 'getCommentsCommentsLength',
    GET_CONVERSATION_LIST = 'getConversationList',
    GET_CONVERSATION_BY_ID = 'getConversationById'
};

export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_USER_BY_ID, id],
        queryFn: async () => await axios.get('/api/users/getUserById', { params: { id: id } }),
        enabled: !!id,
        staleTime: 100000
    })
};

export const getSuggestedUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_SUGGESTED_USER],
        queryFn: async () => await axios.get('/api/users/getAllUsers'),
        staleTime: 100000
    })
};

// export const useFollowButtonMutation = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({ receiverId, senderId }: { receiverId: string | string[] | undefined, senderId: string | string[] | undefined }) =>
//             await axios.post('/api/socket/followRequest', { senderId: senderId, receiverId: receiverId }),
//         onSuccess: (data) => {
//             queryClient.invalidateQueries({
//                 queryKey: [QUERY_KEY.GET_USER_BY_ID, data?.data.updatedReceiverUser._id],
//             })
//         }
//     })
// }

interface IUseCreatePost {
    userId: string,
    caption: string,
    audio: {
        url: string,
        artist: string,
        endTime: number,
        startTime: number,
    },
    media: IUseNewMedia[]
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, caption, audio, media }: IUseCreatePost) => {
            await axios.post('/api/users/post', {
                userId: userId,
                caption: caption,
                audio: audio,
                media: media
            })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_POSTS, data?.id]
            })
        }
    })
}

export const useGetPosts = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_POSTS, id],
        queryFn: async () => await axios.get('/api/users/getAllPosts', { params: { userId: id } }),
        enabled: !!id,
        staleTime: 100000
    })
};

export const useGetPostsById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_POSTS_BY_ID],
        queryFn: async () => await axios.get('/api/users/getPostById', { params: { postId: id } }),
        enabled: !!id,
    })
};

export const usePinAndUnpinByPosts = ({ currentPostId, userId }: { currentPostId: string, userId: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, isPinned, userId }: { postId: string, isPinned: boolean, userId: string }) => {
            await axios.patch('/api/users/pinandunpin', { postId: postId, isPinned: isPinned, userId: userId })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_POSTS_BY_ID, data?._id]
            }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.GET_POSTS, userId]
                })
        }
    })

};

export const usePinAndUnpinByPostsById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, isPinned, userId }: { postId: string, isPinned: boolean, userId: string }) => {
            await axios.patch('/api/users/pinandunpin', { postId: postId, isPinned: isPinned, userId: userId })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_POSTS_BY_ID, data?.postId]
            }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.GET_POSTS, data?.postId]
                })
        }
    })

};

export const usedeletPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, userId }: { postId: string, userId: string }) => {
            await axios.delete('/api/users/deletePost', {
                params: { postId: postId, userId: userId }
            })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_POSTS, data?.id]
            })
        }
    })
};

export const useGetLikes = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_LIKES],
        queryFn: async () => await axios.get('/api/users/getLikes', { params: { postId: id } }),
        enabled: !!id,
        staleTime: 100000
    })
};

export const useGetCommentsLikes = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_COMMENTS_LIKES],
        queryFn: async () => await axios.get('/api/users/getLikes', { params: { postId: id } }),
        enabled: !!id,
        staleTime: 100000
    })
};

export const useLikeDislikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, currentUserLoggedInId, isLike }: { postId: string, currentUserLoggedInId: string, isLike: boolean }) => {
            await axios.patch('/api/users/likeDislikePost', { postId: postId, userId: currentUserLoggedInId, isLike: isLike })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_LIKES, data?.postId]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_COMMENTS_LIKES, data?.postId]
            })
        }
    })
};

export const useGetSavePost = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_SAVEPOSTS],
        queryFn: async () => await axios.get('/api/users/getSavePost', { params: { postId: id } }),
        enabled: !!id
    })
};

export const useSaveAndUnsavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, currentUserLoggedInId, isSave }: { postId: string, currentUserLoggedInId: string, isSave: boolean }) => {
            await axios.patch('/api/users/saveandunsavePost', { postId: postId, userId: currentUserLoggedInId, isSave: isSave })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_SAVEPOSTS, data?.postId]
            })
        }
    })
};

export const useGetAllSavedPosts = (currentUserId: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_ALL_SAVED_POSTS],
        queryFn: async () => await axios.get('/api/users/allSavedPosts', { params: { currentUserId: currentUserId } }),
        enabled: !!currentUserId,
        staleTime: 100000
    })
};

export const useRepostsAndUnrepost = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, isRepost, userId }: { postId: string, isRepost: boolean, userId: string }) => {
            await axios.patch('/api/users/reposts', { postId: postId, isRepost: isRepost, userId: userId })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_POSTS_BY_ID, data?._id]
            }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.GET_POSTS, userId]
                })
        }
    })

};

interface IUseUpdatedProfileData {
    name: string | undefined;
    bio: string | undefined;
    location: string | undefined;
    link: string | undefined;
    backgroundImage: {
        url: string,
        isUploaded: boolean
    };
    profilePicture: {
        url: string,
        isUploaded: boolean
    };
    profession: string | undefined;
    dob: IUseDob | undefined
};

export const useEditProfile = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ data, userId }: { data: IUseUpdatedProfileData, userId: string }) => {
            await axios.patch('/api/users/editProfile', { updatedProfileData: data, userId: userId })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_USER_BY_ID, userId]
            })
        }
    })
};

export const useGetComments = (postId: String) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_All_POST_COMMENTS, postId],
        queryFn: async () => await axios.get('/api/users/getComments', { params: { postId: postId } }),
        enabled: !!postId,
        staleTime: 100000
    })
};

interface IUsePostComments {
    postId: string;
    userId: string,
    caption: string,
    parentPosts: string[]
    media: IUseCommentNewMedia[],
};

export const useGetCommentsLength = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_COMMENTS_LENGTH],
        queryFn: async () => await axios.get('/api/users/getCommentsLength', { params: { postId: postId } }),
        enabled: !!postId,
        staleTime: 100000
    })
};

export const usePostComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ postId, userId, caption, media, parentPosts }: IUsePostComments) => {
            await axios.post('/api/users/comment', { postId: postId, userId: userId, caption: caption, media: media, parentPosts: parentPosts })
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_All_POST_COMMENTS, postId]
            }),
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.GET_COMMENTS_LENGTH, data?.id]
                })
        },

    })
};

export const getConversationsUser = (currentUserId: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_CONVERSATION_LIST],
        queryFn: async () => await axios.get('/api/users/getAllConversationsList', { params: { currentUserId: currentUserId } }),
        enabled: !!currentUserId,
        staleTime: 100000
    })
}
export const getConverationByID = (conversationId: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.GET_CONVERSATION_BY_ID],
        queryFn: async () => await axios.get('/api/users/getConversationById', { params: { conversationId: conversationId } }),
        enabled: !!conversationId,
        staleTime: 1000
    })
}

