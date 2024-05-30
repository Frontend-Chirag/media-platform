"use client";

import React, { SetStateAction, useEffect, useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image'

import PostImageSlider from '@/components/PostImageSlider'
import PostAudioContent from './PostAudioContent';
import { usePosts } from '@/libs/usePost';
import { ImageType } from '@/components/ModelProvider';

interface IUsePostContent {
    PostType: 'CreatePost' | 'PostComment';
    profilePicture: string;
    media: ImageType[];
    setMedia: React.Dispatch<SetStateAction<ImageType[]>>;
    currentIndex: number;
    setCurrentIndex: (input: number) => void;
    textAreaInput: string,
    setTextAreaInput: (input: string) => void,
    setTextAreaInputLength: (input: number) => void,
    setShowTools: (show: boolean) => void;
}

const PostContent: React.FC<IUsePostContent> = ({
    profilePicture,
    PostType,
    media,
    setMedia,
    currentIndex,
    setCurrentIndex,
    textAreaInput,
    setTextAreaInput,
    setTextAreaInputLength,
    setShowTools
}) => {

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const imagesSliderRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const textAreaCurrentRef = textAreaRef.current;
    // const { media, setMedia, currentIndex, setCurrentIndex } = usePosts();

    useEffect(() => {

        const textLength = 256 - textAreaInput.length;

        setTextAreaInputLength(textLength);

        if (textAreaCurrentRef) {
            if (textAreaCurrentRef.scrollHeight) {
                textAreaCurrentRef.style.height = `${textAreaCurrentRef.scrollHeight ? 'auto' : '0px'}`;
                textAreaCurrentRef.style.height = `${textAreaCurrentRef.scrollHeight}px`;
            }
        }

    }, [textAreaInput, media]);

    useEffect(() => {

        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.clientWidth / 2;
            const newPosition = -currentIndex * (sliderWidth - 4);
            if (imagesSliderRef.current) {
                imagesSliderRef.current.style.transform = `translateX(${newPosition}px)`;
            }
        }

    }, [currentIndex, media]);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    };

    const handleNext = () => {
        if (currentIndex < media.length - 2) {
            setCurrentIndex(currentIndex + 1)
        }
    };

    return (
        <div className={`w-full h-full  flex-col justify-start items-start overflow-hidden mt-1 mb-4  `}>
            <div className={`w-full ${(media.length !== 0) ? 'h-auto ' : 'h-full'} relative overflow-y-auto flex flex-col justify-start items-end `}>
                {/* starting ---- of post content textArea  */}
                <div className='w-full h-auto flex gap-1 mt-1'>
                    <div className='w-[45px] h-[45px] rounded-full relative overflow-hidden'>
                        <Image
                            src={profilePicture ? profilePicture : '/profile-circle.svg'}
                            fill
                            alt='logo'
                            className='object-cover'
                        />
                    </div>
                    <div className='w-[calc(100%-60px)]  h-auto flex flex-col items-end px-1'>
                        <PostAudioContent AudioContentType='PostAudio' />
                        <div className='w-full h-auto flex gap-2'>
                            <textarea
                                ref={textAreaRef}
                                placeholder={PostType === 'CreatePost' ? "What's bring you here today ?" : 'Post your reply'}
                                className={` w-full font-bold  text-lg rounded-lg outline-none 
                                     resize-none  overflow-y-hidden placeholder:text-[20px] text-black dark:text-white px-2
                                     ${PostType === 'CreatePost' ?
                                        'dark:bg-neutral-800  '
                                        : 'bg-transparent placeholder:font-thin placeholder:text-neutral-300'} 
                                  `}
                                maxLength={256}
                                value={textAreaInput}
                                onChange={(e) => setTextAreaInput(e.target.value)}
                                onClick={() => { PostType === 'PostComment' && setShowTools(true) }}
                            />
                        </div>
                    </div>
                </div>
                {/* ending ---- of post content textArea  */}
                {/* staring ---- Image slider*/}
                {media.length > 0 &&
                    <div
                        ref={sliderRef}
                        className='w-[calc(100%-60px)] relative h-auto flex overflow-hidden mt-2 '
                    >

                        {currentIndex > 0 &&
                            <button
                                onClick={handlePrev}
                                className='absolute left-0 top-[50%] z-[9] text-black dark:text-white rounded-full bg-gray-200 hover:bg-gray-300  dark:bg-neutral-700 dark:hover:bg-neutral-800 p-2'>
                                <FaArrowLeft />
                            </button>
                        }
                        {currentIndex < media.length - 2 &&
                            <button
                                onClick={handleNext}
                                className='absolute right-0 top-[50%] z-[9] text-black dark:text-white rounded-full bg-gray-200 hover:bg-gray-300  dark:bg-neutral-700 dark:hover:bg-neutral-800 p-2'>
                                <FaArrowRight />
                            </button>
                        }

                        <div
                            ref={imagesSliderRef}
                            className={`h-auto ${media.length > 1 ? 'w-auto' : `w-full`} transition-all px-1 `}
                        >
                            <PostImageSlider
                                imagesSliderRef={imagesSliderRef}
                                sliderRef={sliderRef}
                                PostType={PostType}
                                media={media}
                                setMedia={setMedia}
                                currentIndex={currentIndex}
                                setCurrentIndex={setCurrentIndex}
                            />
                        </div>

                    </div>
                }
                {/* ending ---- Image slider*/}
            </div>
        </div>
    )
}

export default PostContent