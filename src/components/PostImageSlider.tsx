"use client";

import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa';
import Image from 'next/image'

import { usePostCropper } from '@/libs/usePostImageCropper';
import { usePosts } from '@/libs/usePost';
import { ImageType } from './ModelProvider';


interface IUsePostImageSlider {
    imagesSliderRef: React.RefObject<HTMLDivElement>;
    sliderRef: React.RefObject<HTMLDivElement>;
    PostType: 'PostComment' | 'CreatePost';
    media: ImageType[];
    setMedia: React.Dispatch<SetStateAction<ImageType[]>>;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

const PostImageSlider: React.FC<IUsePostImageSlider> = ({ sliderRef, PostType, imagesSliderRef, media, setMedia, currentIndex, setCurrentIndex }) => {

    const { onCropperOpen, setImageUrl, setIndex, cropperMedia, setCropperMedia } = usePostCropper();

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hiddenImageRef = useRef<HTMLImageElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTag, setShowTag] = useState<boolean[]>(media?.map(() => false));


    const [sliderWidth, setSliderWidth] = useState(0);

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (sliderRef.current) {
                const sliderWidth = sliderRef.current.clientWidth / 2;
                setSliderWidth(sliderWidth)
            }
        });

        return () => {
            window.removeEventListener('resize', () => {
                if (sliderRef.current) {
                    const sliderWidth = sliderRef.current.clientWidth / 2;
                    setSliderWidth(sliderWidth)
                }
            })
        }

    }, [window]);

    useEffect(() => {
        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.clientWidth / 2;
            setSliderWidth(sliderWidth)
        }
    }, [])

    const toggleShowTag = (index: number) => {
        const newShowTags = [...showTag];
        newShowTags[index] = !newShowTags[index];
        setShowTag(newShowTags)
    }

    const onPlay = () => {
        if (videoRef.current) {
            setIsPlaying(true);
            videoRef.current.play()

        }
    };

    const onPause = () => {
        if (videoRef.current) {
            setIsPlaying(false);
            videoRef.current.pause()
        }

    };

    const handleRemoveImage = (index: number) => {
        media.splice(index, 1);
        // Decrement currentIndex if greater than 0
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }

        const newPosition = currentIndex * 279;
        if (imagesSliderRef?.current) {
            imagesSliderRef.current.style.transform = `translateX(${newPosition}px)`
        }
        setMedia(media);
    };

    const handleEdit = (image: string, index: number) => {
        setImageUrl(image);
        setIndex(index)
        setCropperMedia(media)
        onCropperOpen();
    };

    return (
        <div className='w-full h-auto flex gap-2'>

            {media?.map((mediaList, index) => {
                return (
                    <div key={index}
                        style={{
                            width: `${(media?.length > 1) ? `${sliderWidth - 8}px` : '100%'}`,
                            height: `${(media?.length > 1) ? `${sliderWidth}px` : `${sliderWidth * 2}px`}`,
                            position: 'relative'
                        }}
                    >
                        <div className={`absolute top-0 left-0 w-full z-[9] flex ${mediaList.mediaType === 'image' ? 'justify-between ' : 'justify-end '} items-center  mt-1 p-2`}>
                            {mediaList.mediaType === 'image' &&
                                <div className='flex justify-center items-center gap-4'>
                                    <button
                                        onClick={() => handleEdit(mediaList.url?.toString()!, index)}
                                        className='py-2 px-3 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-950 dark:hover:bg-neutral-900 rounded-2xl text-black dark:text-white'>
                                        edit
                                    </button>
                                    {mediaList.tags.length !== 0 && (
                                        <FaUser
                                            onClick={() => toggleShowTag(index)}
                                            className='text-white bg-black  cursor-pointer  dark:text-black dark:bg-white  rounded-full w-[25px] h-[25px] p-[6px]'
                                        />
                                    )
                                    }
                                </div>
                            }

                            <button
                                onClick={() => handleRemoveImage(index)}
                                className='p-2 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-950 dark:hover:bg-neutral-900 rounded-full text-black dark:text-white'>
                                <FaTimes />
                            </button>

                        </div>
                        {mediaList.mediaType === 'image' ?

                            <div className='w-full h-full relative rounded-2xl overflow-hidden'>
                                <Image
                                    ref={hiddenImageRef}
                                    src={mediaList.url?.toString()!}
                                    fill
                                    alt='image'
                                    style={{ objectFit: 'cover' }}
                                    className='object-cover'
                                />
                                {(mediaList.tags.length !== 0 && showTag[index]) && (
                                    mediaList.tags.map((user) => {

                                        const positionX = (media.length > 1 ? 271 : 554) / 350;
                                        const positionY = (media.length > 1 ? 300 : 477) / 350;

                                        return (
                                            <div key={user.taggedUserId} className='w-auto h-[30px] bg-[#000000ba] px-2 absolute z-10  rounded-lg text-white flex justify-center items-center'
                                                style={{
                                                    top: `${(user.positionY * positionY) + 7}px`,
                                                    left: `${(user.positionX * positionX) - user.width!}px`
                                                }}
                                            >
                                                <span className='absolute rotate-45 w-[15px] h-[15px] bg-gradient-to-br from-[#000000ba] from-50% to-transparent to-50%  top-[-7px]' />
                                                <p className='text-[12px] '>@{user.username}</p>
                                            </div>
                                        )
                                    })
                                )
                                }
                            </div>
                            : <div className='w-full h-full relative rounded-2xl overflow-hidden'>
                                <video ref={videoRef} src={mediaList.url?.toString()!} loop className='w-full h-full object-cover'
                                    onError={(e) => console.error('Video playback error:', e)}
                                />
                                <div onClick={() => !isPlaying ? onPlay() : onPause()} className='w-full h-full cursor-pointer absolute z-[7] text-[44px] text-gray-300 dark:text-neutral-800 top-0 left-0 bg-transparent flex justify-center items-center' />
                            </div>
                        }
                    </div>
                )
            })}


        </div>
    )
}

export default PostImageSlider