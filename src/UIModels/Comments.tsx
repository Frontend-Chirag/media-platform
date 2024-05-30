
import { useEffect, useState } from "react";
import PostsTools from "./PostsTools";

import { useGetComments, useGetCommentsLength, useGetCommentsLikes, useGetSavePost } from "@/queries/quriesAndmutations";
import CommentCard, { ICommentDataProps } from "./CommentCard";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/libs/useUser";
import { usePostTools } from "@/libs/usePostTools";


interface IUseCommentSection {
    postId: string | undefined;
    parentPostUserData: {
        username: string;
        userId: string;
    }
    commentType: 'StatusCard' | 'PostCard'
}

const Comments: React.FC<IUseCommentSection> = ({ postId, parentPostUserData, commentType }) => {

    const { data: res, isPending } = useGetComments(postId!);
    const { user } = useUser()
    const { newPostId } = usePostTools()
    const [comments, setComments] = useState<ICommentDataProps[]>([]);
    const { data: likes } = useGetCommentsLikes(newPostId.likes);
    const { data: savePost } = useGetSavePost(newPostId.savePost);
    const { data: commentsLength } = useGetCommentsLength(newPostId.commentLength);


    useEffect(() => {
        if (res?.data) {
            setComments(res?.data?.comments)
        }
    }, [res?.data]);

    useEffect(() => {
        if (likes) {
            console.log('comments working')
            setComments((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.likes);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], likes: likes?.data?.likes }
                };

                return newPostData
            })
        }
    }, [likes]);

    useEffect(() => {
        if (savePost) {

            setComments((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.savePost);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], savePosts: savePost?.data?.savePosts }
                };

                return newPostData
            })
        }
    }, [savePost]);

    useEffect(() => {
        if (commentsLength) {
            setComments((prev) => {
                const newPostData = [...prev];
                const postIndex = newPostData?.findIndex((index) => index?._id === newPostId.commentLength);
                if (postIndex !== -1) {
                    newPostData[postIndex] = { ...newPostData[postIndex], comments: commentsLength?.data?.comments }
                };
                return newPostData;
            })
        }
    }, [commentsLength]);

    return (
        <div className='w-full h-auto flex flex-col text-white'>
            {isPending
                ? <div className='w-full h-[300px] flex justify-center'>
                    <ClipLoader size={20} loading color='#2f8bfc' />
                </div>
                : (
                    comments?.length < 0 ?
                        <h1>
                            No Comments yet
                        </h1>
                        : (comments?.map((comment: ICommentDataProps, index: number) => (
                            <div className="w-full h-auto flex flex-col py-6 border-b-[1px] border-gray-400 dark:border-neutral-700  gap-1">
                                <CommentCard
                                    key={index}
                                    commentData={comment}
                                    parentPostUserData={parentPostUserData}
                                    commentType={commentType}
                                    parentPostIds={[postId!, comment._id]}
                                />
                                <div className='w-full h-[60px] flex justify-center items-center bg-white dark:bg-black   '>
                                    <PostsTools
                                        postId={comment?._id!}
                                        currentUserLoggedInId={user?._id!}
                                        PostToolsType={'PostCard'}
                                        likes={comment?.likes!}
                                        saves={comment?.savePosts}
                                        reposts={comment?.reposts}
                                        postData={{
                                            name: comment?.userData?.name,
                                            username: comment?.userData?.username,
                                            caption: comment?.caption,
                                            profilePicture: comment?.userData?.profilePicture,
                                        }}
                                        comments={comment?.comments}
                                        replyTo={[
                                            {
                                                username: parentPostUserData?.username!,
                                                userId: parentPostUserData.userId!
                                            },
                                            {
                                                username: comment?.userData?.username!,
                                                userId: comment?.userData?._id!
                                            }
                                        ]}
                                        parentPostIds={[postId!, comment._id]}
                                    />
                                </div>
                            </div>
                        )))
                )
            }
        </div>
    )
}


export default Comments;