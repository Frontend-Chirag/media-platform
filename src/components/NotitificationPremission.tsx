'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { FaBell } from 'react-icons/fa'
import { FaBellSlash } from 'react-icons/fa6'

const NotitificationPremission = () => {

    const [show, setShow] = useState(false);
    const [showtime, setShowTime] = useState(false);

    const notification = () => {
        if (!('Notification' in window)) {
            alert('This Browers doesn;t support desktop notification');
        } else if (Notification.permission !== 'denied') {
            setShow(false)
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification('Welcome to JustBluff!', {
                        body: 'Have a great time! with JustBluff',
                        icon: 'logo-blue.png'
                    });
                }
            })
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if(Notification.permission === 'granted'){
                setShow(false);
            }else {
                setShow(true);   
            }
        }, showtime ? 1000 : 3000)
    }, [showtime]);


    return (
        <div className={`absolute ${show ? 'top-0 left-0 px-4 py-2' : '-top-[200px] left-0 px-2 py-1 sm:px-4 sm:py-2 md:px-8 md:py-4 '} transition-all w-full z-50`}>
            <div className='px-4 py-2 md:px-8 md:py-4 gap-3   xl:h-[78px] w-full h-[auto] flex flex-col lg:flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-lg shadow-[0_0px_40px_-10px_rgba(0,0,0,0.4)] dark:shadow-none dark dark:border-neutral-600 dark:border-[1px] '>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4 '>
                    <h1 className='text-lg sm:text-2xl font-bold text-[#2f8bfc] sm:mr-4'>Turn on notifications</h1>
                    <p className='text-neutral-500 sm:text-[13px]'>
                        Get the most out of JustBluff by staying up to date with what's happening
                    </p>
                </div>
                <div className='flex justify-center items-center gap-3 mt-3 sm:mt-0'>
                    <button onClick={notification} className='flex gap-1 justify-center items-center text-white bg-[#2f8bfc] px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-md'>
                        <FaBell />
                        Allow notifications
                    </button>
                    <button onClick={() => { setShow(false), setShowTime(true) }} className='flex gap-1 justify-center items-center text-white dark:text-black bg-black dark:bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-md'>
                        <FaBellSlash />
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotitificationPremission