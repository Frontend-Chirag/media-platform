"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';

import { useSettingModel } from '@/libs/useSettingModel';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivacyModel } from '@/libs/usePrivacyModel';
import { IoIosArrowForward, IoMdSunny } from 'react-icons/io';
import { useUser } from '@/libs/useUser';
import { useTheme } from '@/contexts/themeProvider';
import { FaAngleLeft, FaArrowLeft, FaMoon } from 'react-icons/fa';
import { useMoblieSettingModel } from '@/libs/useMobileSettingModel';

const MobileSettingModel = () => {

    const path = usePathname();
    const { user } = useUser();
    const { isOpen, onClose, onOpen } = useMoblieSettingModel();
    const { onPrivacyOpen } = usePrivacyModel();
    const [isLogout, setIsLogout] = useState(false);
    const router = useRouter();
    const { themeMode, darkMode, lightMode } = useTheme();
    const [appreance, setAppreance] = useState(false);

    useEffect(() => {
        if (path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/verify-account' || path === '/update-password') {
            onClose();
        }
    }, [path])

    // Function for handle Logout
    const handleLogout = async () => {
        try {
            setIsLogout(true);
            await axios.post('/api/users/logoutUser');

            router.push('/login');
            toast.success("Logout successfully");

        } catch (error) {
            toast.error("Failed to logout")
        } finally {
            setIsLogout(false)
        }
    }

    // Function for handle theme Mode
    const onThemeChange = (e: any) => {
        const themeStatus = e;
        if (themeStatus) {
            darkMode();
            localStorage.setItem('ScreenMode', 'dark')

        } else {
            lightMode();
            localStorage.setItem('ScreenMode', 'light')
        }
    }

    // Function for handle setting Model
    const handleMobileSettingModel = () => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    }


    return (
        <div className={` w-full h-full flex justify-between items-start flex-col absolute ${isOpen ? 'left-0' : 'left-[-100%]'} dark:text-white text-black transition-all bg-neutral-800    z-[9] `}>
            <div className={`w-full h-[75px] flex justify-start items-center dark:bg-black bg-white border-b-[1px] px-4 gap-5 border-b-neutral-500 `}>
                <FaArrowLeft onClick={handleMobileSettingModel} className='text-[#2f8bfc] cursor-pointer text-2xl font-bold' />
                <h1 className='text-2xl font-bold'>Settings</h1>
            </div>
            <div className={` flex flex-col p-2 w-full h-full dark:bg-neutral-800 bg-white gap-2`}>
                <button className={` ${appreance ? 'hidden' : 'flex'} w-full h-[45px] cursor-pointer flex  px-2 justify-between items-center border-b-[1px]  dark:border-b-neutral-500 border-b-gray-300 `}
                    onClick={() => setAppreance(true)}>
                    <span className='flex justify-start items-center gap-2'>
                        {themeMode === 'dark'
                            ? <FaMoon />
                            : <IoMdSunny className='text-yellow-500' />
                        } Switch Appreance
                    </span>
                    <p className='text-sm text-neutral-400 flex gap-1 justify-center items-center'>
                        <IoIosArrowForward  className='text-[#2f8bfc]'/>
                    </p>
                </button>
                <button className={` ${appreance ? 'hidden' : 'flex'} w-full h-[45px] cursor-pointer flex  px-2 justify-between items-center border-b-[1px] dark:border-b-neutral-500 border-b-gray-300`}
                    onClick={onPrivacyOpen}>
                    <p className='text-md '>Account Privacy</p>
                    <p className='text-sm text-neutral-400 flex gap-1 justify-center items-center'>
                        {user?.isPrivate ? 'Private' : 'Public'}  <IoIosArrowForward  className='text-[#2f8bfc]'/>
                    </p>
                </button>
                {appreance &&
                    (<>
                        <div
                            onClick={() => setAppreance(false)}
                            className='w-full h-[45px] cursor-pointer flex  px-2 justify-start items-center border-b-[1px] dark:border-b-neutral-500 border-b-gray-300 '>
                            <FaAngleLeft className='text-[#2f8bfc] ml-2 mr-2' />
                            <h1>Switch Appreance</h1>
                            <span className='ml-[25px] text-xl'>
                                {themeMode === 'dark'
                                    ? <FaMoon />
                                    : <IoMdSunny className='text-yellow-500' />
                                }
                            </span>
                        </div>
                        <div className='dark:hover:bg-black hover:bg-gray-200 w-full flex justify-between  gap-4 items-end px-4 py-2 rounded-lg border-none outline-none'
                        >
                            <p className='text-md '>Dark Mode</p>

                            <label className="switch">
                                <input type='checkbox' value='' onChange={(e) => onThemeChange(e.currentTarget.checked)} checked={themeMode === 'dark'} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </>
                    )}
            </div>
            <div className={`w-full h-[75px] dark:bg-black  bg-white flex justify-start dark:border-none border-t-[1px] border-black p-2 items-center`}>
                <button
                    onClick={handleLogout}
                    className={`bg-[#2f8bfc]  px-4 py-2 text-white  rounded-lg border-none outline-none`}
                >
                    {isLogout ? 'Logging Out...' : 'Log out'}
                </button>
            </div>
        </div >
    )
}

export default MobileSettingModel;