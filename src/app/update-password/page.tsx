"use client"

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as zod from 'zod';
import Image from 'next/image';

import AuthModel from '@/UIModels/AuthModel';
import AuthInputContainer from '@/UIModels/AuthInputContainer';
import Input from '@/UIModels/Input';
import Button from '@/UIModels/Button';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaEye, FaEyeSlash, FaUserLock } from 'react-icons/fa';


// Zod schema for updating password
const updatePasswordSchema = zod.object({
  password: zod.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: zod.string().min(8, 'Password must be at least 8 characters long')
}).refine((values) => values.password === values.confirmPassword, { message: 'Password do not match', path: ['confirmPassword'] })

const UpdatePassword = () => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState('password');
  const [hide, setHide] = useState(false);


  const form = useForm<zod.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(values: zod.infer<typeof updatePasswordSchema>) {
    try {
      setIsLoading(true);

      // Make a request to update the password
      await axios.post('/api/users/updatepassword', values);

      toast.success('Password updated successfully');
      router.push('/login')
      form.reset()

    } catch (error) {
      console.log(error)
      toast.error('Something went wrong, please try again')
      setIsLoading(false)
    }
  }

   // Function to handle password visibility toggle
  const handleHideandSHowPassword = () => {
    if (type === 'password') {
      setType('text')
      setHide(true)
    } else {
      setType('password')
      setHide(false)
    }
  }

  return (
    <div className='w-full h-full'>
      <AuthModel
        link='/forgot-password'
        isLoading={isLoading}
      >
        <div className='w-full'>
          <Image
            src='/update-password.png'
            alt='updatePasswordImage'
            width={200}
            height={200}
            className='object-cover rounded-full shadow-xl'
          />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-2  h-auto px-4 flex flex-col justify-center items-center '>
          <AuthInputContainer >
            <label htmlFor='password' className='text-sm w-full flex font-bold justify-between items-center' >
              <span className='flex gap-1 justify-center items-center text-neutral-400'>
                <RiLockPasswordFill />
                Password
              </span>
              {form.formState.errors.password && <span className='text-[13px] text-red-500'>{form.formState.errors.password.message}</span>}
            </label>
            <Input
              type={type}
              id='password'
              register={form.register("password")}
            />
          </AuthInputContainer>

          <AuthInputContainer >
            <label htmlFor='confirmPassword' className='text-sm w-full font-bold flex justify-between items-center' >
              <span className='flex gap-1 justify-center items-center text-neutral-400'>
                <FaUserLock />
                Confirm Password
              </span>
              {form.formState.errors.confirmPassword && <span className='text-[13px] text-red-500'>{form.formState.errors.confirmPassword.message}</span>}
            </label>
            <div className='relative w-full'>
              <Input
                type={type}
                id='confirmPassword'
                register={form.register("confirmPassword")}
              />
              <span className='absolute z-1 right-1 top-3 cursor-pointer' onClick={handleHideandSHowPassword}>
                {hide ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </AuthInputContainer>

          <div className='w-full flex flex-col justify-center items-center mt-5 gap-4'>
            <Button
              type='submit'
              defaultString='Update Password'
            />
          </div>
        </form>
      </AuthModel>
    </div >
  )
}

export default UpdatePassword