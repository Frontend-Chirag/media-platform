"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { useAudioModel } from '@/libs/useAudioModel';
// import * as mm from 'music-metadata-browser';
import { ClipLoader } from 'react-spinners'; import { formatMinutes } from '@/constant';
import { IoIosArrowDown } from 'react-icons/io';
import AudioTrimmer from './AudioTrimmer';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';
import { url } from 'inspector';
import Image from 'next/image';
import PostContainer from '@/UIModels/PostContainer';


const AudioComponent = () => {

    const { isAudioTrimModel, onAudioTrimModelClose, AudioContent, setAudioContent, setTrimAudioContent } = useAudioModel();

    const [audioLoading, setAudioLoading] = useState(false);
    const [currentAudioSeconds, setCurrentAudioSeconds] = useState(0);
    const [songTimer, setSongTimer] = useState(10);
    const [isPlaying, setIsPlaying] = useState(true);
    const [milliseconds, setMilliseconds] = useState(100)
    const [isSecondsChange, setIsSecondsChange] = useState(false);
    const [isAnimation, setIsAnimation] = useState(false);
    const [isHardCore, setIsHardCore] = useState(false);
    const [isTrimming, setIsTrimming] = useState(false);
    const [audioData, setAudioData] = useState({
        duration: 0,

    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current && isHardCore) {
            audioRef.current.currentTime = currentAudioSeconds;
            audioRef.current.play()
            setIsPlaying(false)
        }
    }, [currentAudioSeconds, isPlaying, isHardCore]);

    useEffect(() => {
        const checkAudioEnd = () => {
            if (audioRef.current) {
                if (audioRef.current.currentTime >= currentAudioSeconds + songTimer) {
                    audioRef.current.pause();
                    setIsPlaying(true);
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
    }, [isPlaying, songTimer]);

    // useEffect(() => {
    //     const audioFileData = async () => {
    //         try {
    //             if (AudioContent.url) {
    //                 setAudioLoading(true)

    //                 const metadata = await mm.fetchFromUrl(AudioContent.url);

    //                 setAudioData({
    //                     duration: metadata.format.duration!
    //                 })
    //                 setAudioLoading(false);
    //             }
    //         } catch (error) {
    //             console.error('Error reading metadata:', error);
    //         }
    //     }

    //     audioFileData();
    // }, [AudioContent.url]);

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(true)
            setIsHardCore(false)
            setIsAnimation(false)
        }
    }

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play()
            setIsPlaying(false);
            setIsHardCore(true);
            setIsAnimation(true)
        }
    };

    const handleSecondsChange = (index: number) => {
        setSongTimer(index);
        const converstionFactor = (index * 10) - 20;
        setMilliseconds(converstionFactor);
        setIsPlaying(true)
        setCurrentAudioSeconds(0);
        setIsSecondsChange(false);

    };

    // const trimAudioBuffer = (buffer: AudioBuffer, startTime: number, endTime: number) => {
    //     const sampleRate = buffer.sampleRate;
    //     const startFrame = Math.floor(startTime * sampleRate);
    //     const endFrame = Math.floor(endTime * sampleRate);
    //     const duration = endTime - startTime;
    //     const channels = buffer.numberOfChannels;

    //     // Validate startFrame and endFrame to prevent out-of-bounds errors
    //     if (startFrame < 0 || startFrame >= buffer.length || endFrame < 0 || endFrame >= buffer.length) {
    //         console.error('Invalid startFrame or endFrame.');
    //         return null; // Handle invalid input
    //     }

    //     // Create a new AudioBuffer for the trimmed audio
    //     const audioCtx = new window.AudioContext();
    //     const trimmedBuffer = audioCtx.createBuffer(channels, Math.ceil(duration * sampleRate), sampleRate);

    //     for (let channel = 0; channel < channels; channel++) {
    //         const sourceData = buffer.getChannelData(channel).subarray(startFrame, endFrame);
    //         const targetData = trimmedBuffer.getChannelData(channel);
    //         targetData.set(sourceData); // Copy data from source to target
    //     }

    //     return trimmedBuffer;
    // };

    // const createBlobFromAudioBuffer = async (trimAudioBuffer: AudioBuffer) => {
    //     const audioCtx = new AudioContext();
    //     const audioBufferSource = audioCtx.createBufferSource();
    //     audioBufferSource.buffer = trimAudioBuffer;

    //     const audioData = trimAudioBuffer.getChannelData(0); // Assuming mono audio
    //     const audioBlob = new Blob([audioData], { type: 'audio/mp3' });

    //     return audioBlob;
    // };

    // const handleTrim = async () => {
    //     try {
    //         setIsTrimming(true);
    //         const startTime = currentAudioSeconds;
    //         const endTime = currentAudioSeconds + songTimer;

    //         if (songFile) {
    //             const audioCtx = new window.AudioContext();
    //             const fileBuffer = await songFile.arrayBuffer();
    //             const audioBuffer = await audioCtx.decodeAudioData(fileBuffer);

    //             const trimBuffer = trimAudioBuffer(audioBuffer, startTime, endTime);

    //             if (trimBuffer) {
    //                 const trimmedAudioBlob = await createBlobFromAudioBuffer(trimBuffer);
    //                 settrimmedAudioFile(trimmedAudioBlob);
    //             }
    //         }

    //         setIsTrimming(false);
    //         onAudioModelClose();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleTrim = () => {

        setIsTrimming(true)

        const startTime = currentAudioSeconds;
        const endTime = currentAudioSeconds + songTimer;

        setTrimAudioContent(
            AudioContent.url,
            AudioContent.title,
            AudioContent.artist,
            startTime,
            endTime
        )

        setIsHardCore(false)
        setIsTrimming(false);
        onAudioTrimModelClose()
    };

    const handleCloseAudioModel = () => {
        setAudioContent('', '', '', '');
        setIsPlaying(true);
        setIsPlaying(true)
        setIsHardCore(false)
        setIsAnimation(false)
        onAudioTrimModelClose();
    }

    return (
        <PostContainer show={isAudioTrimModel}>
            <audio ref={audioRef} src={AudioContent.url && AudioContent.url} className='hidden' />
            {/* starting of header  */}
            <div className='w-full flex h-[80px]  justify-between items-center gap-2 px-4   '>
                <div className='flex justify-start items-end gap-5'>
                    {isTrimming ?
                        <ClipLoader
                            size={10}
                            color='#2f8bfc'
                            loading
                        />
                        :
                        <FaCheck
                            onClick={handleTrim}
                            className='text-[#2f8bfc] cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                        w-[35px] h-[35px] p-2
                        '
                        />
                    }
                    <h1 className=' text-[#2f8bfc] text-2xl font-bold'>Edit Song </h1>
                </div>

                <FaTimes
                    onClick={handleCloseAudioModel}
                    className='text-[#2f8bfc] cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                        w-[35px] h-[35px] p-2
                        '
                />
            </div>
            {audioLoading
                ? <div className='w-full h-full flex justify-center items-center '>
                    <ClipLoader
                        size={20}
                        color='#2f8bfc'
                        loading
                    />
                </div>
                : <div className='w-full h-full flex flex-col'>
                    <div className='w-full h-[70px] flex justify-between items-end px-4 '>
                        <div className='flex justify-center items-start h-full gap-2  border-b-[1px] border-gray-300 dark:border-neutral-600 '>
                            <div className='w-[40px] h-[40px] rounded-full relative overflow-hidden '>
                                <Image
                                    src={AudioContent.image && AudioContent.image}
                                    fill
                                    alt='music'
                                />
                            </div>
                            <div className='flex flex-col justify-center items-start'>
                                <h1 className='text-lg font-bold dark:text-white text-black relative'>{AudioContent.title}</h1>
                                <span className='flex justify-start items-start gap-4'>
                                    <p className='text-sm  dark:text-neutral-300 text-black relative'>{AudioContent.artist}</p>
                                    <p className='text-sm  dark:text-neutral-300 text-black relative'>{formatMinutes(audioData.duration)}</p>
                                </span>
                            </div>
                        </div>
                        <span className='flex justify-center items-end '>
                            {!isPlaying
                                ? <FaCirclePause onClick={handlePause} className='text-[#2f8bfc] cursor-pointer  rounded-full
                                                 w-[35px] h-[35px] ' />
                                : <FaCirclePlay onClick={handlePlay} className='text-[#2f8bfc]  cursor-pointer  rounded-full
                                                   w-[35px] h-[35px] ' />
                            }
                        </span>
                    </div>
                    <div className='w-full h-full flex flex-col overflow-hidden px-4 mt-2 '>
                        <div className='w-full h-[calc(100%-100px)] flex flex-col  '>
                            <div
                                onClick={() => setIsSecondsChange(!isSecondsChange)}
                                className='w-[200px] h-[30px] flex justify-center items-center cursor-pointer dark:bg-neutral-900 bg-gray-300 rounded-md relative '>
                                <p className=' gap-2 dark:text-white text-black text-[14px] '>
                                    {songTimer}s
                                </p>
                                <IoIosArrowDown className='absolute right-2 top-2 text-white ' />
                                <div className={`w-[250px] h-[100px] absolute z-[4]  bottom-[-110px] dark:bg-black bg-gray-300 left-0 rounded-lg border-2 dark:border-neutral-900 border-gray-300   ${isSecondsChange ? 'flex' : 'hidden'} px-2 `}>
                                    <div className='w-full h-full flex flex-col items-center  gap-2 overflow-hidden overflow-y-auto'>
                                        {Array.from({ length: audioData.duration }, (_, index) => {

                                            if (index < 10) {
                                                return;
                                            } else if (index > 60) {
                                                return
                                            }

                                            return (
                                                <div
                                                    onClick={() => handleSecondsChange(index)}
                                                    className='w-full py-2 flex justify-center items-center dark:text-white text-black cursor-pointer border-b-[1px] dark:border-white border-black ' key={index}>
                                                    {index} seconds
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className='w-full h-full  relative flex justify-center items-center overflow-hidden'>
                                <div className={`${isAnimation ? 'circle right-5 top-5' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle top-0 left-0' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle left-[300px] bottom-16' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle right-[100px] bottom-6' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle top-10 right-[400px]' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle left-[100px]' : 'hidden'}`} />
                                <div className={`${isAnimation ? 'circle left-12 top-[200px]' : 'hidden'}`} />

                                <div className='absolute z-[2]'>
                                    {!isPlaying
                                        ? <FaCirclePause onClick={handlePause} className='text-[#2f8bfc] cursor-pointer  rounded-full
                                                 w-[100px] h-[100px] ' />
                                        : <FaCirclePlay onClick={handlePlay} className='text-[#2f8bfc]  cursor-pointer  rounded-full
                                                   w-[100px] h-[100px] ' />
                                    }
                                </div>
                            </div>
                        </div>
                        <AudioTrimmer
                            duration={audioData.duration}
                            setCurrentAudioSeconds={setCurrentAudioSeconds}
                            isPlaying={isPlaying}
                            customDuration={songTimer}
                            milliseconds={milliseconds}
                            setIsHardCore={setIsPlaying}
                            songTimer={songTimer}
                            currentAudioSeconds={currentAudioSeconds}
                        />
                    </div>
                </div>
            }
        </PostContainer>
    )
}

export default AudioComponent