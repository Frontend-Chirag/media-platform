"use client";

import { useNameAndUsernameModel } from '@/libs/useEditModel';
import { useLoading } from '@/libs/useLoading';
import { useUser } from '@/libs/useUser'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa'

const EditNameUsernameBioModel = () => {

    const route = useRouter();
    const { IsSetLoading, onSetLoading } = useLoading();
    const { user, setUser } = useUser();
    const { name, username, bio } = user || {};
    const { value, IsOpenNameAndUsername, onCloseNameAndUsername, } = useNameAndUsernameModel();
    
    const [onChangeName, setOnChangeName] = useState(name);
    const [onChangeUsername, setOnChangeUsername] = useState(username);
    const [onChangeBio, setOnChangeBio] = useState(bio);

    if (!IsOpenNameAndUsername) {
        return;
    };

    async function handleUpdateNameAndUsername() {
        try {
            // Set loading state to indicate that the update process is in progress
            IsSetLoading();
    
            // Check the value to determine whether to update name, bio, or username
            if (value === 'name') {
                // Update the name
                await axios.post('/api/users/editName', { name: onChangeName });
                // Fetch the updated user information
                const res = await axios.get('/api/users/getCurrentUserInfo');
                if (res.data.user) {
                    // Set the updated user information in the state
                    setUser(res.data.user);
                }
                // Refresh the route to reflect the changes
                route.refresh();
                // Reset loading state and display success message
                onSetLoading();
                toast.success('Name updated successfully');
            } else if (value === 'bio') {
                // Update the bio
                await axios.post('/api/users/editBio', { bio: onChangeBio });
                // Fetch the updated user information
                const res = await axios.get('/api/users/getCurrentUserInfo');
                if (res.data.user) {
                    // Set the updated user information in the state
                    setUser(res.data.user);
                }
                // Refresh the route to reflect the changes
                route.refresh();
                // Reset loading state and display success message
                onSetLoading();
                toast.success('Bio updated successfully');
            } else {
                // Update the username
                await axios.post('/api/users/editUsername', { username: onChangeUsername });
                // Fetch the updated user information
                const res = await axios.get('/api/users/getCurrentUserInfo');
                if (res.data.user) {
                    // Set the updated user information in the state
                    setUser(res.data.user);
                }
                // Refresh the route to reflect the changes
                route.refresh();
                // Reset loading state and display success message
                onSetLoading();
                toast.success('Username updated successfully');
            }
    
        } catch (error) {
            // Handle errors, e.g., display an error message
            console.log(error);
        }
    }
    
    return (
        <div
            className='w-full h-full bg-white dark:bg-black  absolute top-0 left-0 flex flex-col p-2  z-[99]'
        >
            <div className='w-full h-[70px] flex justify-between items-center'>
                <FaTimes className='dark:text-neutral-200 text-black text-2xl cursor-pointer'
                    onClick={() => {
                        onCloseNameAndUsername(), value === 'name' ? setOnChangeName(name) : setOnChangeUsername(username)
                    }}
                />
                <FaCheck className='text-[#2f8bfc] text-2xl cursor-pointer'
                    onClick={() => { onCloseNameAndUsername(), handleUpdateNameAndUsername() }}
                />
            </div>
            <p className='md:text-lg text-sm dark:text-neutral-400 text-black mt-2'>
                {value === 'name' ? 'Name' : (value === 'bio' ? 'Bio' : 'Username')}
            </p>
            {value === 'name' ?
                <input
                    value={onChangeName}
                    onChange={(e) => setOnChangeName(e.target.value)}
                    className='w-full h-[50px] border-b-[1px] p-2 mt-1 bg-transparent border-neutral-600 outline-none  '
                />
                : (value === 'bio' ?
                    <textarea
                        value={onChangeBio}
                        onChange={(e) => setOnChangeBio(e.target.value)}
                        className='w-full h-auto border-b-[1px] px-2 mt-1 resize-none bg-transparent border-neutral-600 outline-none  '
                    />
                    :
                    <input
                        value={onChangeUsername}
                        onChange={(e) => setOnChangeUsername(e.target.value)}
                        className='w-full h-[50px] border-b-[1px] p-2 mt-1 bg-transparent border-neutral-600 outline-none  '
                    />
                )
            }
        </div>
    )
}

export default EditNameUsernameBioModel