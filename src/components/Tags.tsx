"use client";

import Image from 'next/image';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import FollowingTab from './FollowingTab';
import { useUser } from '@/libs/useUser';
import { FaTimes } from 'react-icons/fa';



interface TagsProps {
    index: number;
    imageUrl: string;
    isTag: boolean;
    searchQuery: string;
    taggedUser: TaggedUserprops[]
    taggedWidth: number[]
    setSearchQuery: React.Dispatch<SetStateAction<string>>
    setIsTag: React.Dispatch<SetStateAction<boolean>>;
    setTaggedUser: React.Dispatch<SetStateAction<TaggedUserprops[]>>
    setTaggedWidth: React.Dispatch<SetStateAction<number[]>>
}

export interface TaggedUserprops {
    taggedUserId: string;
    username: string,
    name: string;
    image: string;
    positionX: number;
    positionY: number;
    width?: number
}

const Tags: React.FC<TagsProps> = ({ taggedWidth, setTaggedWidth, index, imageUrl, isTag, setIsTag, searchQuery, setSearchQuery, taggedUser, setTaggedUser }) => {

    const { user } = useUser();
    const [taggedPosition, setTaggedPosition] = useState({
        x: 0,
        y: 0,
    });;
    const taggedContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const current = taggedContainer.current;
        if (current && (taggedUser.length !== taggedWidth.length)) {
            setTaggedWidth((prev) => [...prev, (current.clientWidth / 2)]);
        }
    }, [taggedUser]);

    useEffect(() => {
        console.log(taggedWidth);
    }, [taggedWidth])

    const handlePosition = (e: React.MouseEvent<HTMLDivElement>) => {

        setIsTag(!isTag);

        const rect = e.currentTarget.getBoundingClientRect();
        const positionX = e.clientX - rect.left;
        const positionY = e.clientY - rect.top;

        setTaggedPosition({
            x: positionX,
            y: positionY,
        })

    };

    const handleTag = (id: string, username: string, image: string, name: string,) => {

        const checkforUser = taggedUser.find((user) => user.taggedUserId.includes(id));
        if (!checkforUser) {
            setTaggedUser((prev) => [
                ...prev,
                {
                    taggedUserId: id,
                    username: username,
                    image: image,
                    name: name,
                    positionX: taggedPosition.x,
                    positionY: taggedPosition.y,
                }
            ])
        }
        setIsTag(false);
        setSearchQuery('@');
    };

    const handleRemoveTagged = (tagIndex: number) => {

        if (taggedUser.length !== 0) {
            console.log('taggedremove', index)
            const newTagged = [...taggedUser];
            const newWidth = [...taggedWidth];
            newTagged.splice(tagIndex, 1)
            newWidth.splice(tagIndex, 1);
            setTaggedWidth(newWidth)
            setTaggedUser(newTagged)

            console.log('newTagged', newTagged,)
        }
    }

    return (
        <div className='w-full h-full flex flex-col justify-start items-center px-2 relative overflow-hidden '>

            {searchQuery === '@'
                ?
                <div className='w-[350px] h-[350px] relative cursor-pointer select-none' onClick={(e) => handlePosition(e)}>
                    <Image
                        src={imageUrl && imageUrl}
                        fill
                        alt='image '
                        className='object-cover'
                    />

                    {isTag &&
                        <div className='w-[95px] h-[30px] bg-[#000000ba] absolute z-10  rounded-lg text-white flex justify-center items-center'
                            style={{
                                top: `${taggedPosition.y + 7}px`,
                                left: `${taggedPosition.x - (95 / 2)}px`
                            }}
                        >
                            <span className='absolute rotate-45 w-[15px] h-[15px] bg-gradient-to-br from-[#000000ba] from-50% to-transparent to-50%  top-[-7px]' />
                            <p className='text-[13px] '>Who's this</p>
                        </div>
                    }

                    {taggedUser?.length !== 0 && (
                        taggedUser?.map((user, tagIndex) => {

                            return (
                                <div key={user.taggedUserId} ref={taggedContainer} id='tagContainer' className='w-auto h-[30px] bg-[#000000ba] px-2 absolute z-10  rounded-lg text-white flex justify-center items-center'
                                    style={{
                                        top: `${user.positionY + 7}px`,
                                        left: `${user.positionX - taggedWidth[tagIndex]}px`
                                    }}
                                ><span className='absolute rotate-45 w-[15px] h-[15px] bg-gradient-to-br from-[#000000ba] from-50% to-transparent to-50%  top-[-7px]' />
                                    <p className='text-[12px]'>@{user.username}</p>
                                </div>
                            )
                        })
                    )}
                </div>
                :
                <FollowingTab
                    id={user?._id!}
                    showFollowing={true}
                    type='tag'
                    handleTag={(id, username, image, name) => handleTag(id, username, image, name)}
                    tagSearchQuery={searchQuery}
                />

            }
            <div className='w-full h-[calc(100%-350px)] px-2 py-1'>
                <h2 className='font-bold text-black dark:text-white'>Tags</h2>
                <div className='w-full h-full overflow-y-auto overflow-hidden mt-2'>
                    {taggedUser?.length !== 0 &&
                        <>
                            {
                                taggedUser?.map((data, tagIndex) => (
                                    <div key={data.taggedUserId} className={`w-full flex justify-between items-center h-[35px] mb-1 rounded-md  px-2 `}>
                                        <div className='w-auto h-full flex justify-start items-center gap-3'>
                                            <div className='w-[30px] h-[30px] relative rounded-full overflow-hidden '>
                                                <Image src={data.image ? data.image : '/profile-circle.svg'} fill alt='profileImage' />
                                            </div>
                                            <div className='w-auto  flex flex-col leading-[18px] line justify-center items-start'>
                                                <p className='font-bold text-[12px] text-black dark:text-white'>{data.username}</p>
                                                <p className='font-light text-[13px] text-gray-400 dark:text-neutral-400'>{data.name}</p>
                                            </div>
                                        </div>
                                        <FaTimes
                                            onClick={() => handleRemoveTagged(tagIndex)}
                                            className='text-[#2f8bfc] cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-800 rounded-full
                                          w-[25px] h-[25px] p-1'
                                        />
                                    </div>
                                ))
                            }
                        </>
                    }

                </div>
            </div>
        </div>
    )
}

export default Tags