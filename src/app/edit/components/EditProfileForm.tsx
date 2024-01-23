"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowDown } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { useUser } from '@/libs/useUser';
import { useUploadModel } from '@/libs/useUploadModel';
import { useNameAndUsernameModel } from '@/libs/useEditModel';
import { useLoading } from '@/libs/useLoading';


const EditProfileForm = () => {

    const { setValue, onOpenNameAndUsername } = useNameAndUsernameModel();
    const { IsSetLoading, onSetLoading } = useLoading();
    const { onOpen, setInputRef } = useUploadModel();
    const { user, setUser } = useUser();
    const { name, username, bio, gender, profilePicture } = user || {};

    const route = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [editGender, setEditGender] = useState('Male')
    const [customGender, setCustomGender] = useState(false);
    const [imagePath, setImagePath] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //     // Set the inputRef to the DOM element with the id 'profilePicture'
    //     inputRef.current = document.getElementById('profilePicture') as HTMLInputElement | null;
    // }, []);


    useEffect(() => {
        // Upload image when imagePath changes
        const uploadImage = async () => {
            try {
                IsSetLoading();

                // Check if imagePath is not null
                if (imagePath !== null) {
                    const formData = new FormData();
                    formData.append('profilePicture', imagePath);

                    // Upload image using the '/api/users/uploadFile' endpoint
                    await axios.post('/api/users/uploadFile', formData);

                    // Retrieve updated user information after image upload
                    const res = await axios.get('/api/users/getCurrentUserInfo');

                    // Update the user state with the new information
                    if (res.data.user) {
                        setUser(res.data.user);
                    }

                    // Refresh the route and show success message
                    route.refresh();
                    toast.success('Photo updated successfully');
                }

                // Reset loading state
                onSetLoading();
            } catch (error) {
                console.log(error);
            }
        };

        uploadImage();
    }, [imagePath]);

    useEffect(() => {
        // Handle gender change
        if (gender !== undefined && editGender !== gender && !customGender) {
            handleEditGender();
        }
    }, [editGender]);

    const handleEditGender = async () => {
        try {
            IsSetLoading();

            // Send a request to update the gender
            await axios.post('/api/users/editGender', { gender: editGender });

            // Retrieve updated user information after gender update
            const res = await axios.get('/api/users/getCurrentUserInfo');

            // Update the user state with the new information
            if (res.data.user) {
                setUser(res.data.user);
            }

            // Refresh the route and show success message
            route.refresh();
            onSetLoading();
            toast.success('Gender updated successfully');
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='w-full h-full flex flex-col transition-all dark:text-[#fff]  text-[#000] gap-4'>
            <div className='w-full md:h-[143px] h-auto flex flex-col justify-center items-center p-4 gap-2 '>
                <div className='flex md:flex-row flex-col justify-start items-center md:gap-2 gap-6 '>
                    <input
                        id='profilePicture'
                        className='hidden'
                        type='file'
                        accept='image/*'
                        name='profilePicture'
                        onChange={(e) => {
                            setImagePath(e.target.files ? e.target?.files?.[0] : null)
                        }}
                        ref={inputRef}
                    />
                    <div className='w-[100px] h-[100px] relative '>
                        <Image
                            src={profilePicture ? profilePicture : '/profile-circle.svg'}
                            alt='profile'
                            fill
                            className='rounded-full bg-black object-cover border-1 overflow-hidden'
                        />
                    </div>
                </div>
                <button
                    type='button'
                    onClick={() => { onOpen(), setInputRef(inputRef) }}
                    className='w-[135px] h-[34px] text-[#2f8bfc] text-sm md:flex hidden justify-center items-center cursor-pointer outline-none' >
                    Edit Picture
                </button>
            </div>

            <div className='w-full flex flex-col gap-4 mt-6'>
                <h1 className='font-bold text-md'>Name</h1>
                <input
                    id='name'
                    defaultValue={name}
                    onClick={() => { setValue('name'); onOpenNameAndUsername() }}
                    className='w-full h-[34px] dark:border-b-[1px] dark:border-b-neutral-600 rounded-lg dark:rounded-none bg-gray-200 dark:bg-black outline-none p-2'
                />
            </div>
            <div className='w-full flex flex-col gap-4 mt-6'>
                <h1 className='font-bold text-md'>Username</h1>
                <input
                    id='username'
                    defaultValue={username}
                    onClick={() => { setValue('username'); onOpenNameAndUsername() }}
                    className='w-full h-[34px]  dark:border-b-[1px] dark:border-b-neutral-600 rounded-lg dark:rounded-none bg-gray-200 dark:bg-black outline-none p-2'
                />
            </div>
            <div className='w-full flex flex-col gap-4 mt-6'>
                <h1 className='font-bold text-md'>Bio</h1>
                <input
                    id='bio'
                    defaultValue={bio}
                    onClick={() => {
                        setValue('bio');
                        onOpenNameAndUsername()
                    }}
                    className='w-full h-[50px] p-2  custom-scrollbar rounded-2xl resize-none
                    dark:border-b-[1px] dark:border-b-neutral-600 dark:rounded-none dark:text-[#fff] text-[#000] bg-gray-200 dark:bg-black text-md outline-none'

                />
            </div>
            <div className='w-full h-full flex flex-col gap-4 mt-6 relative'>
                <h1 className='font-bold text-md'>Gender</h1>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-[50px]  px-2 flex justify-between cursor-pointer items-center text-[#000] rounded-2xl bg-gray-200 dark:bg-black dark:hover:bg-neutral-900 dark:border-[1px] dark:border-neutral-600 dark:text-[#fff] text-md 
                outline-none  ${editGender === '' ? 'border-[1px] border-red-800' : 'border-none'}`}>
                    {gender}
                    <IoIosArrowDown className='text-neutral-600 ' />
                </div>
                <div className={`w-[366px] h-[312px] py-4 bg-[#fff] dark:bg-neutral-900 ${isOpen ? 'flex' : 'hidden'} flex-col justify-between items-center absolute top-[-263px] right-[50px] 
                dark:shadow-lg dark:shadow-black shadow-md shadow-gray-400 rounded-2xl overflow-hidden  `} >
                    <div
                        onClick={() => { setEditGender('Male'), setIsOpen(false), setCustomGender(false) }}
                        className='w-full h-[60px] cursor-pointer flex justify-between items-center px-4 hover:bg-gray-200 dark:hover:bg-neutral-800'>
                        <p>Male</p>

                        {editGender === 'Male'
                            ?
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] flex justify-center items-center dark:border-neutral-100 border-gray-500  text-black'>
                                <FaCheck />
                            </span>
                            :
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] dark:border-neutral-100 border-gray-500 ' />
                        }
                    </div>
                    <div
                        onClick={() => { setEditGender('Female'), setIsOpen(false), setCustomGender(false) }}
                        className='w-full h-[60px] cursor-pointer flex justify-between items-center px-4 hover:bg-gray-200 dark:hover:bg-neutral-800'>
                        <p>Female</p>

                        {editGender === 'Female'
                            ?
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] flex justify-center items-center dark:border-neutral-100 border-gray-500  text-black'>
                                <FaCheck />
                            </span>
                            :
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] dark:border-neutral-100 border-gray-500 ' />
                        }
                    </div>
                    <div className='w-full h-[100px] cursor-pointer flex flex-col justify-between items-start px-4 py-2 hover:bg-gray-200 dark:hover:bg-neutral-800'>
                        <div
                            onClick={() => { setEditGender(''); setIsOpen(false) }}
                            className='w-full flex justify-between items-center'>
                            <p>Custom</p>
                            {editGender === ''
                                ?
                                <span className='w-[25px] h-[25px] rounded-full border-[1px] flex justify-center items-center dark:border-neutral-100 border-gray-500  text-black'>
                                    <FaCheck />
                                </span>
                                :
                                <span className='w-[25px] h-[25px] rounded-full border-[1px] dark:border-neutral-100 border-gray-500 ' />
                            }
                        </div>
                        {editGender === '' &&
                            <span className='text-red-800 text-sm font-semibold mb-1'>Gender cannot be empty</span>
                        }
                        <div className='w-full h-full flex justify-between items-center gap-2'>

                            <input className={`w-full h-[45px] bg-gray-400 text-[#fff] dark:bg-black dark:text-white text-md outline-none p-2 rounded-xl
                             ${editGender === '' ? 'border-[1px] border-red-800' : 'border-none'} `}
                                onChange={(e) => { setEditGender(e.target.value), setCustomGender(true) }}
                            />
                            {customGender &&
                                <button
                                    onClick={handleEditGender}
                                    className='p-2 bg-[#2f8bfc] text-sm rounded-md outline-none border-none'>save</button>
                            }
                        </div>

                    </div>
                    <div
                        onClick={() => { setEditGender('Prefer not to say'), setIsOpen(false), setCustomGender(false) }}
                        className='w-full h-[60px] cursor-pointer flex justify-between items-center px-4 hover:bg-gray-200 dark:hover:bg-neutral-800'>
                        <p>Prefer not to say</p>
                        {editGender === 'Prefer not to say'
                            ?
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] flex justify-center items-center dark:border-neutral-100 border-gray-500  text-black'>
                                <FaCheck />
                            </span>
                            :
                            <span className='w-[25px] h-[25px] rounded-full border-[1px] dark:border-neutral-100 border-gray-500 ' />
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditProfileForm