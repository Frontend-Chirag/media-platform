'use client';

import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

import MediaItem from './MediaItem';
import { Song } from '@/types/type';
import { useAudioModel } from '@/libs/useAudioModel';
import PostContainer from '@/UIModels/PostContainer';

export const revalidate = 0;

const PostSongsList = () => {

    const { onAudioModelClose, onAudioTrimModelOpen, isAudioModel, setAudioContent, } = useAudioModel();

    const [searchQuery, setSearchQuery] = useState('');
    const [isResult, setIsResult] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);


    useEffect(() => {

        const searchSongs = async () => {
            if (isAudioModel) {
                setIsResult(true)

                const res = await axios.get(`/api/users/supabaseActions/getSongsByTitle`, { params: { searchQuery: searchQuery } })
                setSongs(res.data)

                setIsResult(false)
            }
        }

        searchSongs();

    }, [searchQuery, isAudioModel]);

    const handleSelect = (url: string, imageUrl: string, title: string, artist: string) => {
        setAudioContent(url, imageUrl, title, artist)
        onAudioModelClose();
        onAudioTrimModelOpen();
    }

    return (
        <PostContainer show={isAudioModel} classnames='p-2'>
            <div className='w-full h-[60px] flex justify-start items-start gap-4'>
                <FaArrowLeft
                    onClick={() => { onAudioModelClose() }}
                    className='text-[#2f8bfc] cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                     w-[35px] h-[35px] p-2'
                />
                <h1 className=' text-[#2f8bfc] text-2xl font-bold'>SoundTracks </h1>
            </div>
            <input
                className='flex w-full rounded-md text-black dark:text-white bg-gray-300 dark:bg-neutral-700 border border-transparent py-3 px-3 text-sm   placeholder:text-neutral-400  focus:outline-none'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for track!'
            />
            {isResult ?
                <div className='w-full h-full flex justify-center items-start py-2 '>
                    <ClipLoader
                        size={25}
                        color='#2f8bfc'
                        loading
                    />
                </div>
                :
                <div className="w-full h-[450px] flex gap-2 mt-7 flex-col  overflow-y-auto overflow-hidden ">
                    {songs.length === 0 ?
                        <>
                            <div className="w-full h-full flex justify-start items-start text-neutral-400 p-2">
                                <h1>No Related track Found</h1>
                            </div>
                        </>
                        :
                        songs.map((song: Song) => (
                            <MediaItem
                                key={song.id}
                                song={song}
                                onClick={(url: string, imageUrl: string) => handleSelect(url, imageUrl, song.title, song.author)}
                            />
                        ))
                    }

                </div>
            }
        </PostContainer>
    )
}

export default PostSongsList