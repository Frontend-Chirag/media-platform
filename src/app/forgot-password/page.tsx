"use client";

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { MdEmail } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { forgotPasswordSchema } from '@/validation/forgotpassword';
import AuthModel from '@/UIModels/AuthModel';
import AuthInputContainer from '@/UIModels/AuthInputContainer';
import Button from '@/UIModels/Button';
import Input from '@/UIModels/Input';

const Forgotpassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    
    // Initialize react-hook-form
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    });

    // Submit handler function
    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        try {
            setIsLoading(true);

            // Send a request to the '/api/users/forgotpassword' endpoint
            const response = await axios.post('/api/users/forgotpassword', values);
            console.log(response);

            // Show success message
            toast.success('Check your email for reset password link');
        } catch (error) {
            console.log(error);

            // Show error message
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);

            // Reset the form after submission
            form.reset();
        }
    }

    return (
        <div className='w-full h-full'>
            <AuthModel
                link='/login'
                linkText='Back to'
                linkTextTwo='Login'
                isLoading={isLoading}
            >
                <div className='w-full flex justify-center items-center '>
                    <Image
                        src='/reset-lock.png'
                        alt='resetImage'
                        width={100}
                        height={100}
                        className='rounded-full object-cover'
                    />
                </div>
                <h1 className='auth_right-container-text font-semibold text-center text-white'>Forgot Password</h1>
                <p className='font-semibold text-sm text-center text-neutral-400'>Enter your <span className='text-[#2f8bfc]'>email</span> and we'll send you a <span className='text-[#2f8bfc]'>link to reset</span> your Password</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-auto px-4 flex flex-col justify-center items-center'>
                    <AuthInputContainer >
                        <label htmlFor='email' className='text-sm w-full flex justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center text-neutral-400'>
                                <MdEmail />
                                Email
                            </span>
                            {form.formState.errors.email && <span className='text-[13px] text-red-500'>{form.formState.errors.email.message}</span>}
                        </label>
                        <Input
                            type='email'
                            id='email'
                            register={form.register("email")}
                        />
                    </AuthInputContainer>
                    <div className='w-full flex flex-col justify-center items-center mt-5 gap-4'>
                        <Button
                            type='submit'
                            defaultString='Submit'
                        />
                    </div>
                </form>
            </AuthModel>
        </div>
    )
}

export default Forgotpassword