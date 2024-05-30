"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

import { useSocket } from '@/contexts/socket-provider';
import { usePrivacyModel } from '@/libs/usePrivacyModel';
import { useSettingModel } from '@/libs/useSettingModel';
import { useUser } from '@/libs/useUser';
import { pusherClient } from '@/utils/pusher';

const PrivacyModel = () => {

    const { socket } = useSocket();
    const { onClose } = useSettingModel();
    const { isPrivacyOpen, onPrivacyClose, switchtoPublic, swichtoPrivate, switchPrivacy } = usePrivacyModel();
    const { user, setUser } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [toggleSwitch, setToggleSwitch] = useState(false);


    useEffect(() => {
        if (user?.isPrivate === false) {
            swichtoPrivate('Private');
            setToggle(false);


        } else if (user?.isPrivate === true) {
            switchtoPublic('Public');
            setToggle(true);
        }

    }, [user, toggle, toggleSwitch]);



    const handleSwitch = async () => {
        try {
            setIsLoading(true)

            const res = await axios.post('/api/socket/privateAccount', { id: user?._id });

            setUser((prev) => ({
                ...prev,
                isPrivate: res?.data?.isPrivate
            }))

            setIsLoading(false)
            setToggleSwitch(false)
            onClose()

        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    }

    return (
        <div className={`w-full h-full absolute bg-white  transition-all  dark:bg-black z-[999] dark:text-white flex flex-col left-0 top-0 px-4 ${isPrivacyOpen ? 'flex' : 'hidden'} `}>
            <div className=' w-full h-[85px]  flex items-center justify-start gap-4 border-b-[1px] border-b-neutral-700 '>
                <button className='p-2 text-xl rounded-full text-[#2f8bfc] border-none outline-none'
                    onClick={() => { onClose(), onPrivacyClose(), setToggleSwitch(false) }}>
                    <FaArrowLeft />
                </button>

                <h1 className='text-2xl'>Account Privacy</h1>
            </div>
            <div className='w-full h-full flex flex-col relative overflow-hidden'>
                <div className='w-full h-12  mb-10 flex justify-between items-center'>
                    <h3 className='text-lg'>Private Account</h3>
                    <div className={`w-[40px] h-4 ${toggle ? 'bg-[#2f8bfc67]' : 'bg-neutral-600'} rounded-2xl relative flex items-center cursor-pointer`}
                        onClick={() => setToggleSwitch(true)}
                    >
                        <span
                            className={`
                            absolute   
                            ${toggle ? 'right-0' : 'left-0'}
                            ${toggle ? 'bg-[#2f8bfc]' : 'bg-neutral-100'}
                             w-5 
                             h-5 
                             rounded-full
                             transition-all
                             `}
                        >
                        </span>
                    </div>
                </div>
                <p className='text-md text-neutral-400'>
                    When your account is public, your profile and posts can be seen by anyone<br />
                    When your account is private , only the followers you approve can see what you share,
                    including your photos and your followers and following lists.
                </p>
                <div className={`
                w-full 
                h-full  
                flex 
                items-end
                justify-end
                absolute ${toggleSwitch ? 'bottom-[0]' : '-bottom-[100%]'} 
                left-0 
                transition-all 
                z-[99]  
                bg-[#ffffffc5]
                dark:bg-[#00000052] 
                px-10 
                py-4
                `}>
                    <button className='
                     w-full
                     h-[50px] 
                     rounded-lg 
                     bg-[#2f8bfc] 
                     text-md 
                     text-white
                     flex
                     justify-center
                     items-center
                     gap-2
                     '
                        onClick={handleSwitch}
                    >
                        switch to {isLoading ? <ClipLoader loading={true} color='#fff' size={20} /> : switchPrivacy}
                    </button>
                </div>
            </div>

        </div >
    )
}

export default PrivacyModel