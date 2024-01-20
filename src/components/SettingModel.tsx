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
import { FaAngleLeft, FaMoon } from 'react-icons/fa';

const SettingModel = () => {

    const path = usePathname();
    const { user } = useUser();
    const { isOpen, onClose } = useSettingModel();
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


    return (
        <div className={`  ${appreance ? 'h-auto w-[250px]' : 'h-[300px] w-auto'}
        dark:bg-neutral-900  dark:text-white
        e text-[#000] dark:shadow-md dark:shadow-neutral-800 shadow-md shadow-gray-600 bg-[#fff]  z-[999]    ${isOpen ? 'fixed' : 'hidden'} bottom-[110px] left-[33px] rounded-md 
        flex justify-start items-start flex-col gap-2 p-2  transition-all 
        `}>
            <div className={`${appreance ? 'hidden' : 'flex'} w-full h-11 flex justify-center items-center border-b-[1px] border-b-neutral-500 mb-4`}>
                <h1>Settings</h1>
            </div>
            {appreance && (
                <div
                    onClick={() => setAppreance(false)}
                    className='w-full h-[45px] cursor-pointer flex justify-center items-center border-b-[1px] border-b-neutral-500 mb-2'>
                    <FaAngleLeft className='dark:text-neutral-400 text-gray-400  mr-2' />
                    <h1>Switch Appreance</h1>
                    <span className='ml-[25px] text-xl'>
                        {themeMode === 'dark'
                            ? <FaMoon />
                            : <IoMdSunny className='text-yellow-500' />
                        }
                    </span>
                </div> 
                )}
            <button
                onClick={handleLogout}
                className={`dark:hover:bg-black hover:bg-gray-200 w-full flex justify-start items-center px-4 py-2  rounded-lg border-none outline-none ${appreance ? 'hidden' : 'flex'}`}
            >
                {isLogout ? 'Logging Out...' : 'Log out'}
            </button>
            <button className={` ${appreance ? 'hidden' : 'flex'} dark:hover:bg-black hover:bg-gray-200 w-full  flex justify-between  gap-4 items-end px-4 py-2 rounded-lg border-none outline-none`}
                onClick={onPrivacyOpen}>
                <p className='text-md '>Account Privacy</p>
                <p className='text-sm text-neutral-400 flex gap-1 justify-center items-center'>
                    {user?.isPrivate ? 'Private' : 'Public'}  <IoIosArrowForward />
                </p>
            </button>

            <button className={` ${appreance ? 'hidden' : 'flex'} dark:hover:bg-black hover:bg-gray-200 w-full  flex justify-start items-center  gap-2 px-4 py-2 rounded-lg border-none outline-none`}
                onClick={() => setAppreance(true)}>
                {themeMode === 'dark'
                    ? <FaMoon />
                    : <IoMdSunny className='text-yellow-500' />
                } Switch Appreance
            </button>

            {appreance &&
                (

                    <button className='dark:hover:bg-black hover:bg-gray-200 w-full flex justify-between  gap-4 items-end px-4 py-2 rounded-lg border-none outline-none'
                    >
                        <p className='text-md '>Dark Mode</p>

                        <label className="switch">
                            <input type='checkbox' value='' onChange={(e) => onThemeChange(e.currentTarget.checked)} checked={themeMode === 'dark'} />
                            <span className="slider round"></span>
                        </label>
                    </button>
                )}
        </div >
    )
}

export default SettingModel