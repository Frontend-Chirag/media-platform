"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


import { LoginValidation } from '@/validation/loginValidation';
import AuthModel from '@/UIModels/AuthModel';
import Button from '@/UIModels/Button';
import AuthInputContainer from '@/UIModels/AuthInputContainer';
import Input from '@/UIModels/Input';


const Login = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // State to manage password visibility
    const [type, setType] = useState('password');
    const [hide, setHide] = useState(false);

    // Initialize react-hook-form
    const form = useForm<z.infer<typeof LoginValidation>>({
        resolver: zodResolver(LoginValidation),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    // Submit handler function
    async function onSubmit(values: z.infer<typeof LoginValidation>) {
        try {
            setIsLoading(true);

            // Send a request to the '/api/users/loginUser' endpoint
            await axios.post('/api/users/loginUser', values);

            // Redirect to home page after successful login
            router.push('/');

            // Show success message
            toast.success('Logged In Successfully');
        } catch (error) {
            console.log(error);

            // Show error message
            toast.error('Failed to Logged In');
        } finally {
            setIsLoading(false);
        }
    }

    // Toggle password visibility
    const handleHideandSHowPassword = () => {
        if (type === 'password') {
            setType('text');
            setHide(true);
        } else {
            setType('password');
            setHide(false);
        }
    }

    return (
        <div className='w-full h-full'>
            <AuthModel
                link='/signup'
                linkText='Need an account ?'
                linkTextTwo='Sign up'
                isLoading={isLoading}

            >
                <h1 className='mb-2 mt-4 text-xl text-white font-semibold'>Welcome back!</h1>
                <h1 className='mb-8 text-lg text-neutral-400 font-semibold'>We're so excited to see you again!</h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-auto flex flex-col justify-center items-center px-4 ' >

                    <AuthInputContainer>
                        <label htmlFor='email' className='text-sm w-full font-bold flex justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center text-neutral-400'>
                                <MdEmail />
                                Email Address
                            </span>
                            {form.formState.errors.email && <span className='text-[13px] text-red-500'>{form.formState.errors.email.message}</span>}
                        </label>
                        <Input
                            type='email'
                            id='email'
                            register={form.register("email")}
                        />
                    </AuthInputContainer>

                    <AuthInputContainer>
                        <label htmlFor='password' className='text-sm w-full font-bold flex justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center text-neutral-400'>
                                <RiLockPasswordFill />
                                Password
                            </span>
                            {form.formState.errors.password && <span className='text-[13px] text-red-500'>{form.formState.errors.password.message}</span>}
                        </label>
                        <div className='relative w-full'>
                            <Input
                                type={type}
                                id='password'
                                register={form.register("password")}
                            />
                            <span className='absolute z-1 right-1 top-3 cursor-pointer' onClick={handleHideandSHowPassword}>
                                {hide ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </AuthInputContainer>

                    <div className='w-full flex flex-col justify-center items-center mt-6 '>
                        <Button
                            type='submit'
                            defaultString='Log In'
                        />
                    </div>
                    <Link href='/forgot-password' className='w-full mt-3 text-right p-2'>
                        <h1 className='text-[#2f8bfc] font-semibold text-lg'>Forgot Password ?</h1>
                    </Link>
                </form>
            </AuthModel>
        </div>
    )
}

export default Login