"use client";

import React, { useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';
import Link from 'next/link';


import { useCreatePost, usePostComment } from '@/queries/quriesAndmutations';
import { useAudioModel } from '@/libs/useAudioModel';
import { usePosts } from '@/libs/usePost';
import { useUser } from '@/libs/useUser';
import { useLoader } from '@/libs/useLoader';
import { IUseReplyToData } from '@/libs/useReply';
import PostBottomNav from '@/UIModels/PostBottomNav';
import PostContent from '@/UIModels/PostContent';
import { handleImages } from '@/constant';

export interface IUsePostProps {
    PostType: 'CreatePost' | 'PostComment';
    PostCommentUser?: IUseReplyToData | IUseReplyToData[];
    postId?: string;
}

export interface IUseNewMedia {
    url: string | undefined | ArrayBuffer | null;
    mediaType: 'image' | 'video' | 'gif';
    tags: [{
        taggedUserId: string;
        username: string;
        positionX: number;
        positionY: number;
    }]
}

export interface IUseCommentNewMedia {
    url: string | undefined | ArrayBuffer | null;
    mediaType: 'image' | 'video' | 'gif';
}

const Post: React.FC<IUsePostProps> = ({ postId, PostType, PostCommentUser }) => {

    const { user } = useUser();
    const { onPostClose, textAreaInput, setTextAreaInput, showTools, setShowTools, media, setMedia, textAreaInputLength, setTextAreaInputLength, currentIndex, setCurrentIndex } = usePosts();
    const { trimAudioContent, setTrimAudioContent } = useAudioModel();
    const { setIsLoader } = useLoader()

    const { mutateAsync: createPost } = useCreatePost();
    const { mutateAsync: postComment } = usePostComment(postId!);

    useEffect(() => {
        if (PostType === 'CreatePost') {
            setShowTools(true);
        }
    }, [PostType])

    const handlePostUpload = async () => {

        const newCaption = textAreaInput;
        const newAudio = trimAudioContent;

        try {

            setIsLoader(true)
            setMedia([]);
            setTextAreaInput('')
            setTrimAudioContent(
                '',
                '',
                '',
                0,
                0
            );
            onPostClose();

            if (PostType === 'CreatePost') {
                const newMedia = media.map((mediaItem) => ({
                    ...mediaItem,
                    tags: mediaItem.tags.map(({ taggedUserId, username, positionX, positionY }) => ({
                        taggedUserId,
                        username,
                        positionX,
                        positionY,
                    })),
                })) as IUseNewMedia[];

                await createPost({
                    userId: user?._id!,
                    caption: newCaption,
                    audio: newAudio,
                    media: newMedia,
                });
            } else if (PostType === 'PostComment' && postId) {

                const newCommentsMedia: IUseCommentNewMedia[] = media.map(({ tags, ...rest }) => rest)

                await postComment({
                    postId: postId,
                    userId: user?._id!,
                    caption: newCaption,
                    media: newCommentsMedia,
                    parentPosts: [postId]
                })
            }

            setIsLoader(false)

        } catch (error: any) {
            console.log(error);
            throw new Error(error)

        }
    };

    return (
        <div className={` w-full relative h-auto max-h-[560px] flex flex-col justify-between items-center  bg-white dark:bg-black   p-2 `}>
            {PostType === 'PostComment' && showTools &&
                <h1 className='text-gray-400 dark:text-neutral-400  text-md mb-2'  >
                    replying  to
                    {Array.isArray(PostCommentUser) ?
                        (PostCommentUser.map((replyto) => (
                            <Link href={`/profile/${replyto?.userId}`} className='text-[#2f8bfc] fontsfamily text-lg'> {replyto?.username}</Link>
                        )))
                        :
                        <Link href={`/profile/${PostCommentUser?.userId}`} className='text-[#2f8bfc] fontsfamily text-lg'> {PostCommentUser?.username}</Link>

                    }
                </h1>
            }

            <PostContent
                profilePicture={user?.profilePicture!}
                PostType={PostType}
                media={media}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setMedia={setMedia}
                textAreaInput={textAreaInput}
                setTextAreaInput={setTextAreaInput}
                setTextAreaInputLength={setTextAreaInputLength}
                setShowTools={setShowTools}
            />

            {showTools &&
                <div className='w-full h-auto'>
                    <PostBottomNav
                        media={media}
                        PostType={PostType}
                        handlePostUpload={() => handlePostUpload()}
                        handleImages={(e) => handleImages({ e, media, setCurrentIndex, setMedia })}
                        textAreaInput={textAreaInput}
                        textAreaInputLength={textAreaInputLength}
                    />
                </div>
            }

        </div>

    )
}

export default Post