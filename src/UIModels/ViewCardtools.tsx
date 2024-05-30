
import PostsTools from "./PostsTools";
import { IPostDataProps } from "@/components/PostsTab";
import Post from "@/components/Post";

interface IUseViewCardtools {
    postsData: IPostDataProps;
    currentLogInUserId: string;
}

const ViewCardtools: React.FC<IUseViewCardtools> = ({ postsData, currentLogInUserId }) => {

    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-[60px] flex justify-center items-center bg-white dark:bg-black px-4'>
                <PostsTools
                    postId={postsData?._id!}
                    currentUserLoggedInId={currentLogInUserId}
                    PostToolsType='statusCard'
                    likes={postsData?.likes}
                    saves={postsData?.savePosts}
                    reposts={postsData?.reposts}
                    comments={postsData?.comments}
                    replyTo={{ userId: postsData.userData._id, username: postsData.userData.username }}
                    postData={{
                        name: postsData.userData.name,
                        username: postsData.userData.username,
                        caption: postsData.caption,
                        profilePicture: postsData.userData.profilePicture
                    }}
                    parentPostIds={[postsData._id]}
                />
             </div>

            <div className='w-full h-auto relative border-t-[1px] border-gray-400 dark:border-neutral-700'>
                <Post
                    PostType='PostComment'
                    postId={postsData._id}
                    PostCommentUser={{ username: postsData?.userData?.username, userId: postsData?.userData?._id }}
                />
            </div>

        </div>
    )
}


export default ViewCardtools;