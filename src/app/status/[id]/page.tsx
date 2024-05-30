"use client";


import Comments from '@/UIModels/Comments';
import PostsTools from '@/UIModels/PostsTools';
import ViewPostCard from '@/UIModels/ViewPostCard';
import { IPostDataProps } from '@/components/PostsTab';
import  Post  from '@/components/Post';
import { useTheme } from '@/contexts/themeProvider';
import { usePostTools } from '@/libs/usePostTools';
import { useUser } from '@/libs/useUser';
import { usePostCard } from '@/libs/usePostCard';
import { useGetCommentsLength, useGetLikes, useGetPostsById, useGetSavePost } from '@/queries/quriesAndmutations';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';


const SpecificPost = () => {

  const [statusData, setStatusData] = useState<IPostDataProps | null>(null);
  const { setPostData, isPostCard } = usePostCard();
  const { themeMode } = useTheme();
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const { newPostId } = usePostTools();
  const { data: likes } = useGetLikes(newPostId.likes);
  const { data: savePost } = useGetSavePost(newPostId.savePost);
  const { data: commentsLength } = useGetCommentsLength(newPostId.commentLength);
  const { data: res, isPending } = useGetPostsById(params?.id!);


  useEffect(() => {
    const statusContainer = document.getElementById('statusContainer');

    statusContainer?.addEventListener('scroll', () => {
      const windowHeight = statusContainer.scrollTop;
      setScrollHeight(windowHeight);
    })

    return () => {
      statusContainer?.removeEventListener('scroll', () => {
        const windowHeight = statusContainer.scrollTop;
        setScrollHeight(windowHeight);
      })
    }

  }, [scrollHeight]);

  useEffect(() => {
    const getPost = () => {
      if (res) {
        setStatusData(res?.data?.post[0]);
      }
    }
    getPost();
  }, [res]);


  useEffect(() => {
    if (likes) {
      if (isPostCard) {
        setPostData((prev) => ({
          ...prev,
          likes: likes?.data?.likes
        }))
      }
      if (statusData?._id === newPostId.likes) {
        setStatusData((prevStatusData) => {
          if (!prevStatusData) return null

          return ({
            ...prevStatusData,
            likes: likes?.data.likes
          })
        })
      } else {
        setStatusData((prevStatusData) => {
          // Ensure PrevStatusData exists
          if (!prevStatusData) {
            return prevStatusData
          }

          // Find the index of the item with the matching _id
          const index = prevStatusData?.parentPostsData?.findIndex(item => item._id === newPostId.likes)!;

          // If no item with the given _id is found. return the prevsious state
          if (index === -1) {
            return prevStatusData
          }

          // Create a copy of current state
          const updatedParentPostData = [...prevStatusData?.parentPostsData!];

          // updated the likes at the specified index
          updatedParentPostData[index] = {
            ...updatedParentPostData[index],
            likes: likes?.data?.likes
          };

          // return the updated state
          return {
            ...prevStatusData,
            parentPostsData: updatedParentPostData
          }

        });
      }
    }
  }, [likes?.data?.likes]);

  useEffect(() => {
    if (savePost) {
      if (isPostCard) {
        setPostData((prev) => ({
          ...prev,
          savePosts: likes?.data?.savePosts
        }))
      }
      if (statusData?._id === newPostId.savePost) {
        setStatusData((prevStatusData) => {
          if (!prevStatusData) return null

          return ({
            ...prevStatusData,
            savePosts: savePost?.data.savePosts
          })
        })
      } else {
        setStatusData((prevStatusData) => {
          // Ensure PrevStatusData exists
          if (!prevStatusData) {
            return prevStatusData
          }

          // Find the index of the item with the matching _id
          const index = prevStatusData?.parentPostsData?.findIndex(item => item._id === newPostId.savePost)!;

          // If no item with the given _id is found. return the prevsious state
          if (index === -1) {
            return prevStatusData
          }

          // Create a copy of current state
          const updatedParentPostData = [...prevStatusData?.parentPostsData!];

          // updated the likes at the specified index
          updatedParentPostData[index] = {
            ...updatedParentPostData[index],
            likes: savePost?.data?.savePosts
          };

          // return the updated state
          return {
            ...prevStatusData,
            parentPostsData: updatedParentPostData
          }

        });
      }
    }
  }, [savePost?.data?.savePosts]);

  useEffect(() => {
    if (commentsLength) {
      if (isPostCard) {
        setPostData((prev) => ({
          ...prev,
          comments: commentsLength?.data?.ceomments
        }))
      }
      if (statusData?._id === newPostId.commentLength) {
        setStatusData((prevStatusData) => {
          if (!prevStatusData) return null

          return ({
            ...prevStatusData,
            likes: commentsLength?.data.comments
          })
        })
      } else {
        setStatusData((prevStatusData) => {
          // Ensure PrevStatusData exists
          if (!prevStatusData) {
            return prevStatusData
          }

          // Find the index of the item with the matching _id
          const index = prevStatusData?.parentPostsData?.findIndex(item => item._id === newPostId.commentLength)!;

          // If no item with the given _id is found. return the prevsious state
          if (index === -1) {
            return prevStatusData
          }

          // Create a copy of current state
          const updatedParentPostData = [...prevStatusData?.parentPostsData!];

          // updated the likes at the specified index
          updatedParentPostData[index] = {
            ...updatedParentPostData[index],
            comments: likes?.data?.comments
          };

          // return the updated state
          return {
            ...prevStatusData,
            parentPostsData: updatedParentPostData
          }

        });
      }
    }
  }, [commentsLength?.data.comments]);


  return (
    <div ref={statusRef} id='statusContainer' className='text-white relative  bg-white dark:bg-black overflow-hidden fontsfamily w-full h-full overflow-y-auto custom-scrollbar '>
      <div className='w-full h-auto  flex justify-start items-center flex-col'>
        <div
          style={{
            background: `${themeMode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
            boxShadow: '0, 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(14px)',
          }}
          className={`w-full h-[70px] ${scrollHeight > 70 ? 'sticky top-0 left-0 z-[99]' : 'relative'} flex justify-start text-xl font-bold items-center px-4 gap-4 `}>
          <FaArrowLeft
            onClick={() => { }}
            className='text-[#2f8bfc]  cursor-pointer  z-[5]'
          />
          <p className='dark:text-white text-black'>
            Post
          </p>
        </div>
        {isPending
          ? <div className='w-full flex justify-center'>
            <ClipLoader size={20} loading color='#2f8bfc' />
          </div>
          :
          (statusData ?
            <div className='w-full  h-auto flex flex-col '>
              {statusData?.parentPostsData?.length! > 0 && (statusData.parentPostsData?.map((parentstatusData, index) => (
                <div key={index} className='w-full h-auto flex flex-col items-end'>
                  <ViewPostCard
                    postsData={parentstatusData!}
                    viewPostCardType='Comment'
                  />
                  <div className='w-[calc(100%-50px)] h-[60px] flex justify-center items-center bg-white dark:bg-black px-4  '>
                    <PostsTools
                      postId={parentstatusData?._id!}
                      currentUserLoggedInId={user?._id!}
                      PostToolsType={'PostCard'}
                      likes={parentstatusData?.likes!}
                      saves={parentstatusData?.savePosts!}
                      postData={{
                        name: parentstatusData?.userData?.name!,
                        username: parentstatusData?.userData?.username!,
                        caption: parentstatusData?.caption!,
                        profilePicture: parentstatusData?.userData?.profilePicture!,
                      }}
                      reposts={parentstatusData?.reposts!}
                      comments={parentstatusData?.comments!}
                      replyTo={{ userId: parentstatusData?.userData?._id, username: parentstatusData?.userData?.username }}
                      parentPostIds={[parentstatusData?._id]}
                    />
                  </div>
                </div>

              ))
              )}
              <div className='w-full h-auto flex flex-col items-end'>
                <ViewPostCard
                  postsData={statusData!}
                  viewPostCardType='statusCard'
                />
                <div className='w-[calc(100%-50px)] h-[60px] flex justify-center items-center bg-white dark:bg-black px-4'>
                  <PostsTools
                    postId={statusData?._id!}
                    currentUserLoggedInId={user?._id!}
                    PostToolsType='statusCard'
                    likes={statusData?.likes}
                    saves={statusData?.savePosts}
                    reposts={statusData?.reposts}
                    comments={statusData?.comments}
                    replyTo={{ userId: statusData.userData._id, username: statusData.userData.username }}
                    postData={{
                      name: statusData.userData.name,
                      username: statusData.userData.username,
                      caption: statusData.caption,
                      profilePicture: statusData.userData.profilePicture
                    }}
                    parentPostIds={[statusData._id]}
                  />
                </div>
                <div className='w-full h-auto relative border-t-[1px] border-gray-400 dark:border-neutral-700'>
                  <Post
                    PostType='PostComment'
                    postId={statusData?._id}
                    PostCommentUser={{ username: statusData?.userData?.username, userId: statusData?.userData?._id }}
                  />
                </div>
                <div className='w-full h-auto border-t-[1px] border-gray-400 dark:border-neutral-700 px-3'>
                  <Comments
                    postId={statusData?._id!}
                    parentPostUserData={{
                      username: statusData?.userData?.username!,
                      userId: statusData?.userData?._id!
                    }}
                    commentType='StatusCard'
                  />
                </div>
              </div>
            </div>
            : <ClipLoader size={25} loading color='#2f8bfc' />
          )
        }
        <div />
      </div>
    </div>
  )
}

export default SpecificPost