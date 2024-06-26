"use client";

import { useTheme } from '@/contexts/themeProvider';
import { useMoblieSettingModel } from '@/libs/useMobileSettingModel';
import { useSettingModel } from '@/libs/useSettingModel';
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const TopNav = () => {

    const pathname = usePathname();
    const { themeMode } = useTheme();
    const { isOpen, onClose, onOpen } = useMoblieSettingModel();

    const paths = pathname === '/';

    // Function for handle setting Model
    const handleSettingModel = () => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    }
    if (!paths) {
        return;
    }

    return (
        <div className='absolute md:hidden  w-full h-[66px] border-b-[1px] border-neutral-700 top-0 flex justify-between items-center'>
            <div className='w-[100px] h-full gap-10 flex justify-center items-center'>
                <Image
                    src={'/logo-blue.png'}
                    width={80}
                    height={80}
                    alt='logo'
                />
            </div>
            <div className='flex gap-6'>
                <Link href='/messages' className='p-3 flex justify-center items-center' >
                    {themeMode === 'dark' ? (<svg version="1.1" id="Capa_1" width="22px" fill="#fff" height="22px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 217.762 217.762" xmlSpace="preserve">
                        <path d="M108.881,5.334C48.844,5.334,0,45.339,0,94.512c0,28.976,16.84,55.715,45.332,72.454
                           c-3.953,18.48-12.812,31.448-12.909,31.588l-9.685,13.873l16.798-2.153c1.935-0.249,47.001-6.222,79.122-26.942
                           c26.378-1.92,50.877-11.597,69.181-27.364c19.296-16.623,29.923-38.448,29.923-61.455C217.762,45.339,168.918,5.334,108.881,5.334z
                           M115.762,168.489l-2.049,0.117l-1.704,1.145c-18.679,12.548-43.685,19.509-59.416,22.913c3.3-7.377,6.768-17.184,8.499-28.506
                           l0.809-5.292l-4.741-2.485C30.761,142.547,15,119.42,15,94.512c0-40.901,42.115-74.178,93.881-74.178s93.881,33.276,93.881,74.178
                           C202.762,133.194,164.547,165.688,115.762,168.489z"
                        />
                    </svg>

                    ) : (<svg version="1.1" id="Capa_1" width="22px" fill="#000" height="22px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 217.762 217.762" xmlSpace="preserve">
                        <path d="M108.881,5.334C48.844,5.334,0,45.339,0,94.512c0,28.976,16.84,55.715,45.332,72.454
                             c-3.953,18.48-12.812,31.448-12.909,31.588l-9.685,13.873l16.798-2.153c1.935-0.249,47.001-6.222,79.122-26.942
                             c26.378-1.92,50.877-11.597,69.181-27.364c19.296-16.623,29.923-38.448,29.923-61.455C217.762,45.339,168.918,5.334,108.881,5.334z
                             M115.762,168.489l-2.049,0.117l-1.704,1.145c-18.679,12.548-43.685,19.509-59.416,22.913c3.3-7.377,6.768-17.184,8.499-28.506
                             l0.809-5.292l-4.741-2.485C30.761,142.547,15,119.42,15,94.512c0-40.901,42.115-74.178,93.881-74.178s93.881,33.276,93.881,74.178
                             C202.762,133.194,164.547,165.688,115.762,168.489z"
                        />
                    </svg>
                    )}
                </Link>
                <div className='flex justify-center items-center p-3 cursor-pointer' onClick={handleSettingModel}>
                    {themeMode === 'dark' ? (
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <title>bar</title>
                            <desc>Created with sketchtool.</desc>
                            <g id="web-app" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="bar" fill="#fff">
                                    <path d="M3,16 L21,16 L21,18 L3,18 L3,16 Z M3,11 L21,11 L21,13 L3,13 L3,11 Z M3,6 L21,6 L21,8 L3,8 L3,6 Z" id="Shape"></path>
                                </g>
                            </g>
                        </svg>

                    ) : (
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <title>bar</title>
                            <desc>Created with sketchtool.</desc>
                            <g id="web-app" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="bar" fill="#000">
                                    <path d="M3,16 L21,16 L21,18 L3,18 L3,16 Z M3,11 L21,11 L21,13 L3,13 L3,11 Z M3,6 L21,6 L21,8 L3,8 L3,6 Z" id="Shape"></path>
                                </g>
                            </g>
                        </svg>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default TopNav;