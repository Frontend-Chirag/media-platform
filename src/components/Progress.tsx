"use client";

import React, { SetStateAction, useEffect, useState } from 'react'

interface IUseProgressProps {
    milliseconds: number;
    isPlaying: boolean;
    progress: number;
    setProgress: (value: number) => void
}
const Progress: React.FC<IUseProgressProps> = ({ isPlaying, milliseconds, progress, setProgress }) => {
    let progressInterval: NodeJS.Timeout | null = null;

    useEffect(() => {
        const updatedProgress = () => {
            if (!
                isPlaying) {
                progressInterval = setInterval(() => {
                    if (progress < 100) {
                        setProgress(progress + 1)
                    }

                }, milliseconds)
            } else {
                setProgress(0)
            }
        }
        updatedProgress();

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        }
    }, [milliseconds, isPlaying, progress])

    return (
        <div style={{ width: `${progress}%` }} className=" h-full flex-grow bg-[#2f8bfc91] rounded-[5px]" />
    )
}

export default Progress