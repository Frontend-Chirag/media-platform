"use client";
import React from 'react'

import { useLoading } from '@/libs/useLoading';



const LoadingModel = () => {

    const { loading } = useLoading();

    if (!loading) {
        return;
    }

    return (
        <div className='w-full h-full absolute top-0 left-0  flex justify-center items-center  bg-[#000000a5] z-[999]'>
            <div className='w-[150px] h-[50px] dark:bg-neutral-800 bg-gray-200 rounded-lg flex justify-center items-center '>
                <h1 className='text-xl font-bold mr-4'>Loading...</h1>
            </div>
        </div>
    )
}

export default LoadingModel