"use client";

import React, {  useCallback, useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import type { IGif } from '@giphy/js-types';

import PostContainer from '@/UIModels/PostContainer';
import { useGIF } from '@/libs/useGIFModel';
import { usePosts } from '@/libs/usePost';


const gifApiSecret = new GiphyFetch('gEcWyx7qwNrehqkWSGWqsfroK4Pm4kFg')


const GIFPickerContainer = () => {

    const { isGIF, onGIFClose, } = useGIF();
    const [searchTerm, setSearchTerm] = useState('');
    const { media, setMedia, setCurrentIndex } = usePosts();

    const fetchGifs = useCallback((offset: number) => {
        if (searchTerm) {
            console.log('search')
            return gifApiSecret.search(searchTerm, {
                offset,
                sort: 'relevant',
                lang: 'es',
                limit: 10,
                type: 'gifs',
            });
        } else {
            return gifApiSecret.trending({ offset, limit: 6 });
        }
    }, [searchTerm]);

    const handleGif = async (url: any) => {
        const { data } = await gifApiSecret.gif(`${url.id}`);
        setMedia((prev) => [...prev, { url: data.images.original.mp4, mediaType: 'gif', tags: [] }]);
        if (media.length > 0) {
            setCurrentIndex(media.length - 1)
        }
        onGIFClose();
    }

    return (
        <PostContainer show={isGIF} classnames='overflow-hidden overflow-y-auto'>
            <div className='w-full flex h-[50px]  justify-start items-center gap-2 px-4 '>
                <FaTimes
                    onClick={() => onGIFClose()}
                    className='text-[#2f8bfc] dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                      w-[35px] h-[35px] p-2
                     '
                />
                <input
                    placeholder='Search for GIFs'
                    className='w-full h-full rounded-[30px] bg-gray-100 dark:bg-neutral-800 
                         text-black dark:text-white  outline-none px-4
                         placeholder:font-[300] placeholder:text-neutral-300 placeholder:text-sm
                         border-[2px] border-[#2f8bfc]
                        '
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='w-full h-full mt-2 md:p-0  px-2'>
                <Grid
                    width={600}
                    columns={2}
                    fetchGifs={fetchGifs}
                    gutter={4}
                    noLink={true}
                    hideAttribution={true}
                    onGifClick={(gif: IGif) => handleGif(gif)}
                />
            </div>
        </PostContainer>
    )
}

export default GIFPickerContainer