"use client";

import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation';

import AuthModel from '@/UIModels/AuthModel'
import { useUserEmail } from '@/utils/getUserEmail'

const ResendVerificationEmail = () => {

    const router = useRouter();

    const { useremail } = useUserEmail();
    const [isLoading, setIsLoading] = useState(false);

    async function resendReVerificationEmail() {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/users/resendVerificationtoken',
                {
                    email: useremail
                }
            );

            if (response.data.status === 200) {
                toast.success('Your email address has already verified');
                router.push('/login');
            }
            
            if (response.data.status === 201) {
                toast.success('Verification email Resent successfully');
            }
            
        } catch (error) {
            console.log();
            toast.error('Failed to resend verification email')
        }finally{
            setIsLoading(false);
        }
    }


    return (
        <div className='w-full h-full'>
            <AuthModel
                link=''
                isLoading={isLoading}
            >
                <div className='w-full h-full flex flex-col '>
                    <div className='w-full flex justify-center items-center '>
                        <Image
                            src='/verify-account.jpg'
                            alt='verifyAccountImage'
                            width={150}
                            height={150}
                            className='object-cover '
                        />
                    </div>
                    <div className='w-full flex justify-center flex-col items-center gap-3'>
                        <h1 className='font-bold'><span className='text-[#2f8bfc]'>Verify </span>your email address</h1>
                        <p className='text-sm font-semibold text-center'>You're almost there! We sent an email to
                            <br /><span className='text-[#2f8bfc]'>{useremail}</span>
                        </p>
                        <p className='text-sm font-semibold text-center'>
                            Just click on the link is that email to complete your signup.
                            If you don't see it. you may need to
                            <span className='text-[#2f8bfc]'> check you spam </span>
                            folder
                        </p>

                        <p className='text-sm font-semibold text-center mt-4'>Still can't find the email? No problem.</p>
                    </div>
                    <div className='w-full flex justify-center items-center mt-1'>
                        <button className='px-4 py-3 rounded-md text-[#fff] bg-[#2f8bfc]'
                            onClick={resendReVerificationEmail}
                        >Resend Verification Email</button>
                    </div>
                </div>
            </AuthModel>
        </div>
    )
}

export default ResendVerificationEmail