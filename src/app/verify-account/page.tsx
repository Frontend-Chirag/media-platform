"use client";

import AuthModel from '@/UIModels/AuthModel'
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const VerifyAccount = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifiedEmail = async () => {
        try {
            setIsLoading(true);
             await axios.post('/api/users/verifyuser');
       
             toast.success('Your email address has been verified successfully');

            router.push('/login')
        } catch (error) {
            console.log(error);
            toast.error('Unable to verify your email address')
        }finally{
            setIsLoading(false)
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
                        <p className='text-sm font-semibold text-center'>
                            <span className='text-[#2f8bfc]'> Please verify your email address </span> by clicking the button below.
                        </p>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <button 
                        onClick={handleVerifiedEmail}
                        className='mt-10 px-4 py-3 rounded-md bg-[#2f8bfc] text-[#fff]'
                        >
                            Verify your email
                        </button>
                    </div>
                </div>
            </AuthModel>
        </div>
    )
}

export default VerifyAccount