import { useAudioModel } from '@/libs/useAudioModel'
import React, { useEffect, useRef, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6'

interface IUsePostAudioContent {
    AudioContentType: 'PostAudio' | 'ShowAudio';
    audio?: {
        url: string,
        title: string
        artist: string,
        endTime: number,
        startTime: number,
    },
}

const PostAudioContent: React.FC<IUsePostAudioContent> = ({ AudioContentType, audio }) => {

    const { trimAudioContent, setTrimAudioContent } = useAudioModel();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHardCore, setIsHardCore] = useState(false);

    useEffect(() => {
        const checkAudioEnd = () => {
            if (audioRef.current) {
                if (audioRef.current.currentTime >= trimAudioContent.endTime) {
                    audioRef.current.pause();
                    setIsPlaying(false)
                }
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', checkAudioEnd);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', checkAudioEnd);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current && isHardCore && trimAudioContent.url) {
            audioRef.current.currentTime = trimAudioContent.startTime;
            audioRef.current.play()
            setIsPlaying(true)
        }
    }, [isPlaying, isHardCore]);


    const handlePause = () => {
        setIsPlaying(false)
        setIsHardCore(false)
        if (audioRef.current) {
            audioRef.current.pause()
        }
    };

    const handlePlay = () => {
        setIsHardCore(true)
        setIsPlaying(true)
        if (audioRef.current) {
            audioRef.current.currentTime = trimAudioContent.startTime
            audioRef.current.play()
        }
        console.log('play')
    };

    const handleRemoveAudio = () => {
        setTrimAudioContent(
            '',
            '',
            '',
            0,
            0
        )
    };

    return (
        <div className='w-full h-auto'>
            {AudioContentType === 'PostAudio'
                ?
                (trimAudioContent.url &&
                    <div className='w-full h-[40px] flex justify-between items-start  text-white'>
                        <p className='text-black dark:text-white text-[sm]'>{trimAudioContent.title}
                            <span className='text-neutral-400 text-sm'> by {trimAudioContent.artist}</span>
                        </p>

                        <audio className='hidden' ref={audioRef} src={trimAudioContent.url && trimAudioContent.url} />

                        <div className='gap-3 flex  justify-center items-center'>
                            {isPlaying
                                ? <FaCirclePause onClick={handlePause} className='text-[#2f8bfc] cursor-pointer  rounded-full
                                            w-[20px] h-[20px] ' />
                                : <FaCirclePlay onClick={handlePlay} className='text-[#2f8bfc]  cursor-pointer  rounded-full
                                            w-[20px] h-[20px] ' />
                            }

                            <FaTrash onClick={handleRemoveAudio} className='text-red-400 cursor-pointer  rounded-full
                                            w-[15px] h-[15px] ' />

                        </div>
                    </div>
                )
                :
                (audio?.url &&
                    <div className='flex justify-start items-center gap-4  text-white'>
                        <p className='text-black dark:text-white text-[sm]'>
                            <span className='text-neutral-400 text-sm'>{audio?.artist}</span>
                        </p>
                        <audio className='hidden' ref={audioRef} src={audio?.url && audio?.url} />
                        <div className='gap-3 flex  justify-center items-center'>
                            {isPlaying
                                ? <FaCirclePause onClick={handlePause} className='text-[#2f8bfc] cursor-pointer  rounded-full w-[20px] h-[20px] ' />
                                : <FaCirclePlay onClick={handlePlay} className='text-[#2f8bfc]  cursor-pointer  rounded-full w-[20px] h-[20px] ' />
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default PostAudioContent