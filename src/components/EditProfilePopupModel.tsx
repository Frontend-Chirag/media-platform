"use client"

import { useCreateProfile } from '@/libs/useCreateProfileModel'
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const EditProfilePopupModel = () => {

    const paths = '/';
    const route = useRouter();
    const pathname = usePathname();
    const { isOpen, onClose, onOpen } = useCreateProfile();


    const handleCheckIsProfileComplete = async () => {
        try {
            const res = await axios.get('/api/users/isCompleteProfile');
            console.log(res.data)
            if (res.data.status === 201) {
                onOpen();
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        if (paths.includes(pathname!)) {
            handleCheckIsProfileComplete();
        }
    }, [pathname])

    const handleclose = () => {
        onClose()
    };

    const handleRoute = () => {
        route.push('/edit')
        onClose()
    }

    return (
        <div className={`w-full h-full bg-[#000000b2] absolute ${isOpen ? "flex" : 'hidden'} top-0 left-0 z-[999] `}>
            <div className='w-full h-full flex justify-center  items-center flex-col '>
                <div className='w-[350px] h-[100px] rounded-lg overflow-hidden bg-white dark:bg-neutral-900 flex flex-col'>
                    <button
                        type='button'
                        onClick={handleRoute}
                        className='dark:hover:bg-neutral-800  hover:bg-gray-200 border-b-[1px] border-neutral-600 w-full h-full flex justify-center items-center'
                    >Go to Edit Profile</button>

                    <button
                        type='button'
                        onClick={handleclose}
                        className='dark:hover:bg-neutral-800 hover:bg-gray-200 w-full h-full flex justify-center items-center'
                    >Skip for now</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePopupModel