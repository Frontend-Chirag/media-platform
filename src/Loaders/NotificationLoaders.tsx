import React from 'react'

const NotificationLoaders = () => {

    const loadersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <>
            {loadersArray.map((index) => (
                <div key={index} className='w-full h-[70px] flex gap-1  border-b-black border-b-[1px] dark:border-b-neutral-700  justify-start items-center '>
                    <div className='w-[40px] h-[40px]  skeleton-loader-circle-Animation  rounded-full bg-gray-200  dark:bg-neutral-900' />
                    <div className='w-[200px] h-[34px] skeleton-loader-content-Animation rounded-lg bg-gray-200 dark:bg-neutral-900' />
                    <div className='w-[100px] h-[34px] skeleton-loader-button-Animation  rounded-lg bg-gray-200 dark:bg-neutral-900
                    ' 
                   />
            
                </div>
            ))
            }
        </>
    )
}

export default NotificationLoaders