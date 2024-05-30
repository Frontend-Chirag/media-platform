"use client";

import { useTheme } from '@/contexts/themeProvider'
import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch';
import React from 'react'
import ConversationsUser from './ConversationsUser';
import { usePathname } from 'next/navigation';


const ConversationsSideBar = () => {

  const { themeMode } = useTheme();
  const pathName = usePathname();
  const { onNewMessageUserSearchOpen, conversationId, type } = useNewMessageUserSearch();


  return (
    <div className={`w-[360px] h-full ${(pathName === '/conversations') || (pathName?.startsWith('/conversations/')) ? 'flex' : 'hidden'} flex-col overflow-hidden overflow-y-auto border-r-[1px]  border-r-gray-200 dark:border-r-neutral-500`}>
      <div className='w-full h-[70px] flex justify-between items-center px-3 '>
        <p className='fontsfamily text-[18px] text-black dark:text-white font-semibold'>Conversations</p>
        <p onClick={() => onNewMessageUserSearchOpen()} className='cursor-pointer'>
          {themeMode === 'dark'
            ? <svg fill="#fff" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M17,7h1V8a1,1,0,0,0,2,0V7h1a1,1,0,0,0,0-2H20V4a1,1,0,0,0-2,0V5H17a1,1,0,0,0,0,2Zm4,4a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.41L9.88,14.3a3,3,0,0,0,4.24,0l2.47-2.47a1,1,0,0,0-1.42-1.42L12.7,12.88a1,1,0,0,1-1.4,0L5.41,7H13a1,1,0,0,0,0-2H5A3,3,0,0,0,2,8V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V12A1,1,0,0,0,21,11Z" /></svg>
            : <svg fill="#000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M17,7h1V8a1,1,0,0,0,2,0V7h1a1,1,0,0,0,0-2H20V4a1,1,0,0,0-2,0V5H17a1,1,0,0,0,0,2Zm4,4a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.41L9.88,14.3a3,3,0,0,0,4.24,0l2.47-2.47a1,1,0,0,0-1.42-1.42L12.7,12.88a1,1,0,0,1-1.4,0L5.41,7H13a1,1,0,0,0,0-2H5A3,3,0,0,0,2,8V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V12A1,1,0,0,0,21,11Z" /></svg>
          }
        </p>
      </div>
      {type === 'Conversation' ?
        <div className='w-full h-auto flex flex-col px-8 py-4 justify-center items-start flex-wrap'>
          <h1 className='text-[30px] font-bold fonstfamily dark:text-[#ffffffac] text-black tracking-wide'>Welcome to your indox!</h1>
          <p className='text-[14px] dark:text-neutral-500 text-gray-200 mt-2 font-semibold tracking-wide'>Drop a line, share posts and with private conversations between you and others on Social</p>
          <button onClick={() => onNewMessageUserSearchOpen()} className='bg-[#2f8bfc] text-[18px] p-6 py-3 rounded-[30px] tracking-wide mt-8 outline-none border-none text-white fontsfamily flex justify-center items-center'>
            Write a message
          </button>
        </div>
        : <div className='w-full h-full overflow-hidden overflow-y-auto'>
          <ConversationsUser />
        </div>
      }

    </div>
  )
}

export default ConversationsSideBar