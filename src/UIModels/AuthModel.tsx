
import AuthLoading from '@/components/AuthLoading'
import Link from 'next/link'
import React from 'react'

interface IAuthModel {
    children: React.ReactNode,
    link: string,
    linkText?: string,
    linkTextTwo?: string,
    isLoading: boolean
}

const AuthModel: React.FC<IAuthModel> = ({ children, link, linkText, linkTextTwo, isLoading }) => {
    return (
        <div className='authContainer'>
            <div className='authContainer_absoluteCircle-one'>
                <div className='authContainer_absoluteCircle-two'></div>
            </div>
            <div className='auth_right-container'>
                <div className='auth_right-containerCircle-one'>
                    <div className='auth_right-containerCircle-two'></div>
                </div>
                {isLoading && <AuthLoading />}
                {children}
            </div>

            <div className='auth_bottom-container' >
                <h3 className='font-bold'>{linkText}</h3>
                <Link href={link} className='auth_right-container-link font-bold text-sm'
                >{linkTextTwo}</Link>
            </div>
        </div>
    )
}

export default AuthModel