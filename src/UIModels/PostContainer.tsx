

import React from 'react'
import { twMerge } from 'tailwind-merge';


interface PostContainerProps {
    show: boolean;
    children: React.ReactNode;
    classnames?: string;
}

const PostContainer: React.FC<PostContainerProps> = ({ show, children, classnames }) => {



    return (
        <div className={`absolute top-0 left-0 bg-[#2f8bfc3c] w-full h-full z-[999] ${show ? 'flex' : 'hidden'} justify-center items-center `}>
            <div className={twMerge(`
            md:w-[600px] 
            md:h-[90%] 
            relative 
            w-full 
            h-full 
            dark:bg-black 
            bg-white 
            md:rounded-[15px] 
            py-1 
            flex  
            flex-col`
            , classnames)}
            >
                {children}
            </div>
        </div>
    )
}

export default PostContainer