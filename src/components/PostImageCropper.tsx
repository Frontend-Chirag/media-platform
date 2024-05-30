"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CropperRef } from 'react-advanced-cropper';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft } from 'react-icons/fa';

import PostContainer from '@/UIModels/PostContainer';
import Tags, { TaggedUserprops } from './Tags';
import ImageCropper from './Cropper';
import { usePostCropper } from '@/libs/usePostImageCropper';
import { usePosts } from '@/libs/usePost';


const PostImageCropper = () => {


    const { isCropper, onCropperClose, imageUrl, index, setIndex, setImageUrl, cropperMedia, setCropperMedia } = usePostCropper();
    const saveCropperRef = useRef<CropperRef>(null);
    const [widthHeight, setWidthHeight] = useState({ width: 353, height: 353 });
    const [scale, setScale] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(1 / 1);
    const [isAspectRatioChange, setIsAspectRatioChange] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [crop, setCrop] = useState(false);
    const [isTag, setIsTag] = useState(false);
    const [taggedUser, setTaggedUser] = useState<TaggedUserprops[]>([]);
    const [searchQuery, setSearchQuery] = useState('@');
    const [isBack, setIsBack] = useState(false);
    const [taggedWidth, setTaggedWidth] = useState<number[]>([])


    useEffect(() => {
        const prevTag = cropperMedia[index]?.tags;
        if (isCropper) {
            setTaggedUser(prevTag)
        }

    }, [imageUrl, isCropper])

    const handleSave = () => {

        setSaveLoading(true)
        setTimeout(() => {
            if (saveCropperRef.current) {
                const canvas = saveCropperRef.current.getCanvas();
                if (canvas) {

                    const croppedImageUrl = canvas.toDataURL('image/png');
                    const newTags = taggedUser.map((user, index) => ({
                        taggedUserId: user.taggedUserId,
                        name: user.name,
                        username: user.username,
                        positionX: user.positionX,
                        positionY: user.positionY,
                        image: user.image,
                        width: taggedWidth[index]
                    }))

                    cropperMedia[index].url = croppedImageUrl;
                    cropperMedia[index].tags = newTags

                    setTaggedUser([])

                    setCropperMedia(cropperMedia)
                    setWidthHeight({ width: 353, height: 353 })
                    setScale(0)
                    setAspectRatio(1 / 1)
                    setIsAspectRatioChange(true)
                }
            }
            setSaveLoading(false)
            setIsBack(false)
            onCropperClose()
        }, 1000);

    };

    const handleDiscardEdit = () => {
        // const prevTag = images[index]
        // setTaggedUser(prevTag.tags)
        setTaggedUser([])
        setCropperMedia(cropperMedia)
        setWidthHeight({ width: 353, height: 353 });
        setScale(0);
        setAspectRatio(1 / 1);
        setIsAspectRatioChange(true);
        setIndex(0)
        setImageUrl('')
        setIsBack(false)
        onCropperClose();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        if (!newValue.startsWith('@')) {
            setSearchQuery("@" + newValue)
        } else {
            setSearchQuery(newValue)
        }
    };

    return (
        <PostContainer key='imageCropper' show={isCropper} classnames='pt-2'>
            {/* starting of header  */}
            <div className={`w-full h-full absolute   z-[20] bg-[#ffffff91] dark:bg-[#00000087] gap-2 md:rounded-[15px] ${isBack ? 'flex' : 'hidden'} flex-col justify-center items-center`}>
                <button onClick={handleDiscardEdit} className='bg-red-500 hover:bg-red-550 text-white  font-bold outline-none border-none rounded-lg w-[150px] h-[50px]'>Skip changes</button>
                <button onClick={handleSave} className='bg-[#2f8bfc] hover:bg-[#2f8bfce0] text-white font-bold  outline-none border-none rounded-lg  w-[150px] h-[50px] flex justify-center items-center'>
                    {saveLoading
                        ? <ClipLoader
                            size={20}
                            loading
                            color='#fff'
                        />
                        :
                        'Save changes'
                    }
                </button>
            </div>
            <div className='w-full flex h-[80px] flex-col gap-1 px-2 relative '>
                <div className='flex justify-between items-center h-[40px]  '>
                    <div className='flex justify-start items-end gap-5 '>
                        <FaArrowLeft
                            onClick={() => setIsBack(!isBack)}
                            className='text-[#2f8bfc] cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full
                        w-[35px] h-[35px] p-2
                        '
                        />
                        <h1 className=' text-[#2f8bfc] text-2xl font-bold'>Edit cropperMedia</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        className='px-4 py-1 bg-[#2f8bfc] text-white  border-none outline-none font-bold rounded-2xl'>
                        {saveLoading ?
                            <ClipLoader
                                size={10}
                                loading
                                color='#fff'
                            />
                            : 'save'
                        }
                    </button>
                </div>
                <div className='flex w-full h-[40px] mb-2'>
                    {isTag ?
                        <input
                            type='text'
                            className={`w-full h-full rounded-lg outline-none border-none text-black dark:text-white dark:bg-neutral-700 font-bold px-2 bg-gray-200`}
                            autoFocus
                            placeholder='search'
                            value={searchQuery}
                            onChange={(e) => handleChange(e)}
                        />
                        :
                        <>
                            <button className='w-[50%] h-full border-none outline-none text-[#2f8bfc] hover:bg-[#2f8bfc] hover:text-white transition-all font-bold text-[17px]'
                                onClick={() => setCrop(false)}
                            >
                                Crop
                            </button>
                            <button className='w-[50%] h-full border-none outline-none text-[#2f8bfc] hover:bg-[#2f8bfc] hover:text-white transition-all  font-bold text-[17px]'
                                onClick={() => setCrop(true)}
                            >
                                Tag
                            </button>
                        </>
                    }
                </div>
            </div>
            {/* ending of header  */}
            {/* starting of cropper */}
            <div className='w-full h-full relative overflow-hidden'>
                <div className='w-full h-full absolute top-0 transition-all'
                    style={{ left: `${crop ? '-100%' : '0'}` }}
                >
                    <div className='w-full h-full mt-2 relative overflow-hidden '
                    >
                        <ImageCropper
                            oldImage={imageUrl}
                            saveCropperRef={saveCropperRef}
                            widthHeight={widthHeight}
                            setWidthHeight={setWidthHeight}
                            scale={scale}
                            setScale={setScale}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                            isAspectRatioChange={isAspectRatioChange}
                            setIsAspectRatioChange={setIsAspectRatioChange}
                        />

                    </div>
                </div>

                <div className='w-full h-full absolute transition-all'
                    style={{ left: `${crop ? '0%' : '-100%'}` }}
                >
                    <Tags
                        index={index}
                        isTag={isTag}
                        imageUrl={imageUrl}
                        searchQuery={searchQuery}
                        taggedUser={taggedUser}
                        taggedWidth={taggedWidth}
                        setIsTag={setIsTag}
                        setSearchQuery={setSearchQuery}
                        setTaggedUser={setTaggedUser}
                        setTaggedWidth={setTaggedWidth}
                    />
                </div>
            </div>

            {/* ending of cropper */}
        </PostContainer>
    )
}

export default PostImageCropper