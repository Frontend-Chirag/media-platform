"use client";

import React, { useState } from 'react'
import axios from 'axios';

import { useAccessTokenModel } from '@/libs/useAccessTokenModel';


const NewAccessTokenButton = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { tokenState } = useAccessTokenModel();

    const handleNewAccessToken = async () => {
        try {
            setIsLoading(true);

            await axios.post('/api/users/getNewAccessToken');

            setIsLoading(false);
            window.location.reload()

        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    };

    return (
        <div className={`w-full h-full absolute ${tokenState ? 'flex' : 'hidden'} top-0 left-0 z-[99] bg-white/50 dark:bg-black/50 flex justify-center items-center `}>
            <h1 className='text-[123px] text-black dark:text-white absolute  '>401</h1>
            <div className='md:w-[700px] md:h-[400px] w-full h-full bg-white/30 backdrop-blur-sm dark:bg-white/10  rounded-lg border-[1px] border-gray-200 dark:border-neutral-800 flex justify-start items-center flex-col py-2'>
                <h1 className='text-[33px] px-2 py-1 rounded-lg text-black dark:text-white font-bold'>UnAuthorized Access Token</h1>
                <p className='text-[19px] tracking-wider text-black dark:text-white'>To get new Access Token click the button down below</p>
                <span className=' w-full flex gap-1 justify-between items-center text-white px-7  py-1 mt-[90px]'>
                    <span className='w-[250px] h-[2px] bg-black ' />
                    <button
                        className='px-4 py-2 rounded-md bg-black text-white'
                        onClick={handleNewAccessToken}
                    >
                        {isLoading ? 'Loading...' : 'Get Token'}
                    </button>
                    <span className='w-[250px] h-[2px] bg-black' />
                </span>
            </div>
        </div>
    )
}

export default NewAccessTokenButton