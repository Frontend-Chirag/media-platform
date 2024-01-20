"use client"

import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

import { useUploadModel } from '@/libs/useUploadModel';
import { useRouter } from 'next/navigation';
import { useUser } from '@/libs/useUser';
import { useLoading } from '@/libs/useLoading';


const UploadImageModel = () => {

    const route = useRouter();

    const { isOpen, onClose, inputRef } = useUploadModel();
    const { IsSetLoading, onSetLoading } = useLoading();
    const { setUser } = useUser();


    // Function for handle Remove Picture
    const handleRemovePicture = async () => {
        try {
            IsSetLoading();
            onClose();

            await axios.post('/api/users/removeCurrentPhoto');
            const res = await axios.get('/api/users/getCurrentUserInfo');
            if (res.data.user) {
                setUser(res.data.user);
            }

            route.refresh();
            onSetLoading();
            toast.success('Photo removed successfully');
        } catch (error) {
            console.log('Failed to remove photo', error)
        }
    }


    return (
        <div className={`w-full z-[999] h-full bg-[#000000b2] absolute ${isOpen ? "flex" : 'hidden'} top-0 left-0 `}>
            <div className='w-full h-full flex justify-center  items-center flex-col '>
                <div className='w-[350px] h-[150px] rounded-lg overflow-hidden bg-white dark:bg-neutral-900 flex flex-col'>


                    <button
                        type='button'
                        onClick={() => { inputRef?.current?.click(), onClose() }}
                        className='dark:hover:bg-neutral-800 hover:bg-gray-200 border-b-[1px] text-[#2f8bfc]  border-neutral-600 w-full h-full flex justify-center items-center'
                    >
                        Upload photo
                    </button>

                    <button
                        onClick={handleRemovePicture}
                        type='button'
                        className='dark:hover:bg-neutral-800 hover:bg-gray-200 border-b-[1px] text-red-500  border-neutral-600 w-full h-full flex justify-center items-center'
                    >
                        Remove current photo
                    </button>

                    <button
                        type='button'
                        onClick={() => onClose()}
                        className='dark:hover:bg-neutral-800 hover:bg-gray-200 w-full h-full flex justify-center items-center'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UploadImageModel