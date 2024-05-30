"use client";

import { useDebounce } from '@/constant';
import { useUser } from '@/libs/useUser';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FadeLoader } from 'react-spinners';

const Search = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [searchedUser, setSearchedUser] = useState([]);
    const router = useRouter();
    const [isSearchLoading, setSearchLoading] = useState(false);
    const { user } = useUser();
    const debounceSearch = useDebounce(searchQuery);

    useEffect(() => {

        const searchForUser = async () => {
            if (searchQuery === '') {
                return;
            }
            try {
                setSearchLoading(true);

                const res = await axios.get('/api/users/search', { params: { searchQuery: debounceSearch } });
                setSearchedUser(res.data)

                setSearchLoading(false)
            } catch (error: any) {
                console.log(error);
                throw new Error(error)
            }
        };

        searchForUser();

    }, [debounceSearch]);

    //TODO: searchHistory
    const handleSeachHistory: any = async (id: string) => {
        try {

            const res = await axios.post('/api/users/searchHistory', {
                userId: user?._id,
                searchUserId: id
            });

            router.push(`/profile/${id}`)

            console.log(res.data)

        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    };


    return (
        <div className='w-full h-full dark:bg-black bg-white dark:text-white text-black flex flex-col px-4 py-8'>
            <div className='w-full h-auto relative '>
                <FaSearch className='absolute dark:text-neutral-300 z-[2] text-gray-400 left-3 top-4' />
                <input
                    className='w-full h-[45px] dark:bg-neutral-800 bg-gray-200 rounded-lg dark:placeholder:text-neutral-300 outline-none border-none pl-10'
                    placeholder='search'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
            </div>

            <div className='w-full h-full flex justify-center items-center overflow-hidden '>
                {isSearchLoading
                    ?
                    <FadeLoader loading={true} color='#2f8bfc' width={7} height={21} />
                    :
                    <div className='w-full h-full flex flex-col gap-3 mt-[45px]'>
                        {searchedUser.map((data: any) => (
                            <Link
                                href={`/profile/${data._id}`}
                                key={data._id}
                                className='w-full h-[65px] flex justify-start items-center gap-4 border-[1px] transition-all hover:dark:bg-neutral-900 hover:bg-gray-200 dark:border-neutral-900 rounded-xl px-2 py-1'
                            >

                                <div className='w-[48px] h-[48px] rounded-full relative overflow-hidden '>
                                    <Image
                                        src={data.profilePicture ? data.profilePicture : '/profile-circle.svg'}
                                        fill
                                        alt='profile'
                                        className='object-cover'
                                    />
                                </div>

                                <div className='flex flex-col justify-center items-start'>
                                    <h2 className='font-bold text-lg'>{data.name} </h2>
                                    <p className='text-sm font-normal text-neutral-400'>{data.username}</p>
                                </div>
                            </Link>
                        ))

                        }
                    </div>
                }
            </div>

        </div>
    )
}

export default Search