"use client";

import { useNewMessageUserSearch } from '@/libs/useNewMessageUserSearch';
import React, { useCallback, useEffect, useState } from 'react'
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { getSuggestedUsers } from '@/queries/quriesAndmutations';
import { useUser } from '@/libs/useUser';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners';
import { MdGroups2 } from 'react-icons/md';
import axios from 'axios';
import { useRouter } from 'next/navigation';



interface IUserNewMessageUsers {
    name: string;
    username: string;
    profilePicture: string;
    _id: string
}


const NewMessageUserSearch = () => {

    const { isNewMessageUserSearch, onNewMessageUserSearchClose, setConversationId } = useNewMessageUserSearch();
    const { user } = useUser();
    const { data: users, isPending } = getSuggestedUsers();
    const [allUsers, setAllUser] = useState<IUserNewMessageUsers[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUserNewMessageUsers[]>([]);
    const router = useRouter();



    useEffect(() => {
        if (users?.data) {
            setAllUser(users?.data)
        }
    }, [users?.data])

    const handleSelectUser = (newSelectedUser: IUserNewMessageUsers) => {
        setSelectedUser((prevSelectedUser) => [...prevSelectedUser, newSelectedUser])
    };

    const handleRemoveSelectedUser = (index: number) => {
        const newSelectedUser = [...selectedUser];
        newSelectedUser.splice(index, 1);

        setSelectedUser(newSelectedUser)
    }

    const handleNext = useCallback(async () => {

        await axios.post('/api/users/conversations', {
            currentUserId: user?._id,
            userId: selectedUser[0]._id
        }).then((data) => {
            console.log('createdConversationWith',data.data)
            setSelectedUser([]);
            onNewMessageUserSearchClose();
            setConversationId(data.data._id)
            router.push(`/conversations/${data.data._id}`);
        })
    }, [selectedUser, router])

    // Filter out the current user from the suggestedUsers list
    const filterCurrentUser = allUsers?.filter((userList: IUserNewMessageUsers) => userList.username !== user?.username);

    return (
        <div className={`absolute top-0 left-0 bg-[#2f8bfc3c] w-full h-full z-[999] ${isNewMessageUserSearch ? 'flex' : 'hidden'} justify-center items-center `}>
            <div className={`md:w-[600px] md:h-[90%] relative w-full h-full  dark:bg-black  bg-white  md:rounded-[15px] py-1  flex  flex-col`}>
                <div className={`w-full  py-3  flex justify-between text-xl font-bold items-center px-4 gap-6 `}>
                    <div className='flex justify-center items-center '>
                        <FaTimes
                            onClick={() => onNewMessageUserSearchClose()}
                            className='text-[#2f8bfc] cursor-pointer text-2xl'
                        />
                        <h3 className='text-[18px] text-white font-bold fontsfamily ml-4'>
                            New Messages
                        </h3>
                    </div>
                    <button
                        onClick={handleNext}
                        className={`px-3 py-1 bg-[#2f8bfc] text-white text-[15px] font-normal border-none outline-none  rounded-2xl`}>
                        Next
                    </button>
                </div>
                <div className='w-full h-[60px] flex justify-center items-center mt-2 px-4'>
                    <input type='text' placeholder='search' className='w-full h-full px-4 py-2 rounded-[20px] fontsfamily bg-black dark:text-white text-black  border-[1px] outline-none dark:border-neutral-700 border-gray-200' />
                </div>
                <div className='w-full h-auto flex flex-wrap py-2 gap-2 mt-4 px-4'>
                    {selectedUser.length !== 0 && (
                        selectedUser.map((selectUser, index) => (
                            <div key={selectUser._id} className='w-auto h-[40px]  flex justify-start items-center  p-2 rounded-[20px] gap-2 border-[1px] dark:border-neutral-800 border-gray-200'>
                                <div className='w-[25px] h-[25px] relative '>
                                    <Image
                                        src={selectUser.profilePicture ? selectUser.profilePicture : '/profile-circle.svg'}
                                        alt='profile picture'
                                        fill
                                        className={`rounded-full object-cover ${!selectUser.profilePicture && 'border-[1px]'} mr-1`}
                                    />
                                </div>
                                <h3 className='truncate fontsfamily dark:text-white text-black'>{selectUser.name}</h3>
                                <FaTimes
                                    onClick={() => handleRemoveSelectedUser(index)}
                                    className='text-[#2f8bfc] cursor-pointer text-md'
                                />
                            </div>
                        ))
                    )}
                </div>
                <div className='w-full h-[90px] px-4  flex justify-start items-center  border-t-[1px] dark:border-t-neutral-500 border-gray-200  border-b-[1px] dark:border-b-neutral-500 border-b-gray-200'>
                    <div className='w-[40px] h-[40px] border-[1px] flex rounded-full justify-center items-center text-md text-[#2f8bfc]  dark:border-neutral-700 border-gray-200'>
                        <MdGroups2 />
                    </div>
                    <p className='text-[16px] text-[#2f8bfc] ml-2'>create group</p>
                </div>
                <div className='w-full h-full overflow-hidden overflow-x-auto gap-2 flex flex-col  pt-4'>
                    {isPending
                        ? <div className='w-full h-[300px] flex justify-center'>
                            <ClipLoader size={20} loading color='#2f8bfc' />
                        </div>
                        : (filterCurrentUser?.map((userList) => (
                            <div onClick={() => handleSelectUser(userList)} key={userList._id} className='w-full py-2 px-4 hover:dark:bg-neutral-900  hover:bg-gray-400 cursor-pointer flex justify-start items-center gap-2 '>
                                <div className='w-[40px] h-[40px] relative '>
                                    <Image
                                        src={userList.profilePicture ? userList.profilePicture : '/profile-circle.svg'}
                                        alt='profile picture'
                                        fill
                                        className={`rounded-full object-cover ${!userList.profilePicture && 'border-[1px]'} mr-1`}
                                    />
                                </div>
                                <div className='flex fonsfamily flex-col'>
                                    <h3 className='truncate dark:text-white text-black text-[16px]'>{userList.name}</h3>
                                    <h3 className='truncate dark:text-neutral-400 text-200 text-[14px]'>@{userList.username}</h3>
                                </div>
                            </div>
                        )))
                    }
                </div>

            </div>
        </div >
    )
}

export default NewMessageUserSearch