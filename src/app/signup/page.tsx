"use client";

import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { formValidation } from '@/validation/formValidation';
import AuthModel from '@/UIModels/AuthModel';
import AuthInputContainer from '@/UIModels/AuthInputContainer';
import Input from '@/UIModels/Input';
import Button from '@/UIModels/Button';
import { MdEmail } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useUserEmail } from '@/utils/getUserEmail';

function SignUp() {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { setEmail } = useUserEmail();

    const [type, setType] = useState('password');
    const [hide, setHide] = useState(false);

    // react-hook-form for form handling
    const form = useForm<z.infer<typeof formValidation>>({
        resolver: zodResolver(formValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        }
    });

    // Function to handle form submission
    async function onSubmit(values: z.infer<typeof formValidation>) {
        try {
            // Set loading state to true
            setIsLoading(true);

            // Set user email using the custom hook
            setEmail(values.email);

            // Make a request to register the user
            const res = await axios.post('/api/users/registerUser', values);

            console.log(res.data);
            // Display success message and redirect to verification page
            toast.success('Account created successfully');
            router.push('/resend-verification-email');
        } catch (error) {
            console.log(error);
            // Display error message if registration fails
            toast.error('Something went wrong');
        } finally {
            // Reset loading state and form
            setIsLoading(false);
            form.reset();
        }
    }

    // Function to toggle password visibility
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
        <div className='w-full h-full '>
            <AuthModel
                link='/login'
                linkText='Already have an account ? '
                linkTextTwo='Log in'
                isLoading={isLoading}
            >
                <h1 className='auth_right-container-text font-semibold text-center '>Sign <span className='text-[#2f8bfc]'>up</span></h1>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full px-6 '  >
                    <AuthInputContainer>
                        <label htmlFor='name' className='text-sm w-full font-bold flex justify-between items-center' >
                            <span className='flex gap-1 justify-center items-center'>
                                <FaRegUserCircle />
                                Name
                            </span>
                            {form.formState.errors.name && <span className='text-[13px] text-red-500'>{form.formState.errors.name.message}</span>}
                        </label>
                        <Input
                            type='text'
                            id='name'
                            register={form.register("name")}
                        />
                    </AuthInputContainer>

                    <AuthInputContainer>
                        <label htmlFor='username' className='text-sm w-full font-bold flex justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center'>
                                <FaUser />
                                Username
                            </span>
                            {form.formState.errors.username && <span className='text-[13px] text-red-500'>{form.formState.errors.username.message}</span>}
                        </label>
                        <Input
                            type='text'
                            id='username'
                            register={form.register("username")}
                        />
                    </AuthInputContainer>

                    <AuthInputContainer>
                        <label htmlFor='email' className='text-sm w-full flex font-bold justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center'>
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

                    <AuthInputContainer >
                        <label htmlFor='password' className='text-sm w-full flex font-bold justify-between items-center'>
                            <span className='flex gap-1 justify-center items-center'>
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
                    <div className='w-full flex flex-col justify-center items-center mt-5 gap-4'>
                        <Button
                            type='submit'
                            defaultString='Sign up'
                        />
                    </div>
                </form>
            </AuthModel>
        </div>
    );
}

export default SignUp