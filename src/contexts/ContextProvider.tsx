"use client";

import React, { createContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

import { useUser } from '@/libs/useUser';
import { IUserProps } from '@/types/type';
import { useAccessTokenModel } from '@/libs/useAccessTokenModel';


const UserContext = createContext<IUserProps | null>(null);


const UserProvider = ({ children }: { children: React.ReactNode; }) => {

    const pathname = usePathname();
    const { user, setUser } = useUser();
    const { setTokenState } = useAccessTokenModel();

    const paths = ['/login', '/signup', '/forgot-password', '/verify-account', '/update-password', '/resend-verification-email'];

    const getCurrentUserInfo = async () => {
        try {
            const res = await axios.get('/api/users/getCurrentUserInfo');
            console.log('tokenState', res.data.tokenState)

            setTokenState(res.data.tokenState)

            if (res.data.user) {
                setUser(res.data.user);
            }
        } catch (error) {
            console.log("Failed to get current user", error)
        }
    }

    useEffect(() => {
        if (!paths.includes(pathname!)) {
            getCurrentUserInfo();
        }
    }, [pathname])


    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext };