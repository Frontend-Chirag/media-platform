import React from 'react'

interface IAuthInputContainer {
    children: React.ReactNode
}

const AuthInputContainer: React.FC<IAuthInputContainer> = ({ children }) => {
    return (
        <div className='flex flex-col justify-start items-start w-full h-auto gap-1 mb-4'>
            {children}
        </div>
    )
}

export default AuthInputContainer