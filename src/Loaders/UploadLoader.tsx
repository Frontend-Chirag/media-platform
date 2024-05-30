"use client";

import { useLoader } from '@/libs/useLoader';
import React from 'react';

const UploadLoader = () => {

    const { isloader } = useLoader();

    return (
        <div className={`w-full ${isloader ? 'flex' : 'hidden'} h-auto px-8 py-1 absolute top-0 left-0 z-[999] box-border `}>
            <div className='w-full h-[30px] flex justify-center items-center px-2 dark:bg-neutral-900 bg-gray-400 rounded-[20px]'>
                <div className='w-full h-[5px] bg-black relative rounded-xl overflow-hidden'>
                    <div className='w-[300px] absolute h-full bg-[#2f8bfc] loaderAnimation' />
                </div>
            </div>
        </div>
    )
}

export default UploadLoader