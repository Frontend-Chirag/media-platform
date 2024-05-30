"use client";

import React, { useEffect, useState, useRef, RefObject, SetStateAction } from 'react';
import { ImageRestriction, CropperRef, mergeRefs, FixedCropper, FixedCropperRef, DefaultSize } from 'react-advanced-cropper';
import { getAbsoluteZoom, getZoomFactor, } from 'advanced-cropper/extensions/absolute-zoom';
import { HiMagnifyingGlassMinus, HiMagnifyingGlassPlus } from 'react-icons/hi2';
import 'react-advanced-cropper/dist/style.css'
import CustomInputRange from './CustomInputRange';

interface IUseCropperProps {
    oldImage: string,
    saveCropperRef: RefObject<CropperRef>;
    widthHeight: {
        width: number,
        height: number
    };
    setWidthHeight: React.Dispatch<SetStateAction<{ width: number, height: number }>>;
    scale: number;
    setScale: React.Dispatch<SetStateAction<number>>;
    aspectRatio: number;
    setAspectRatio: React.Dispatch<SetStateAction<number>>;
    isAspectRatioChange: boolean;
    setIsAspectRatioChange: React.Dispatch<SetStateAction<boolean>>;
}

const ImageCropper: React.FC<IUseCropperProps> = ({ oldImage, saveCropperRef, widthHeight, setWidthHeight, scale, setScale, aspectRatio, setAspectRatio, isAspectRatioChange, setIsAspectRatioChange
}) => {

    const cropperRef = useRef<FixedCropperRef | null>(null);
    const cropper = useRef<CropperRef | null>(null);

    useEffect(() => {
        if (isAspectRatioChange && cropper.current) {
            const currentState = cropper.current.getState();
            const currentSettings = cropper.current.getSettings();
            cropper.current.zoomImage(getZoomFactor(currentState, currentSettings, 0));
        }

    }, [aspectRatio, isAspectRatioChange]);

    const onZoom = (value: number) => {
        setIsAspectRatioChange(false)
        if (cropper.current) {
            const currentState = cropper.current.getState();
            const currentSettings = cropper.current.getSettings();
            const absoluteZoom = getAbsoluteZoom(currentState, currentSettings)
            cropper.current.zoomImage(getZoomFactor(currentState, currentSettings, value));
            setScale(absoluteZoom)
        }
    };

    const zoomIn = () => {
        if (cropper.current) {
            const currentState = cropper.current.getState();
            const currentSettings = cropper.current.getSettings();
            if (scale !== 0.3) {
                const newValue = Math.min(1, Math.max(0, scale + 0.05))
                cropper.current.zoomImage(getZoomFactor(currentState, currentSettings, newValue));
                setScale(scale + 0.05)
            }
        }
    };

    const zoomOut = () => {
        if (cropper.current) {
            const currentState = cropper.current.getState();
            const currentSettings = cropper.current.getSettings();
            if (scale !== 0) {
                const newValue = Math.min(1, Math.max(0, scale - 0.05))
                cropper.current.zoomImage(getZoomFactor(currentState, currentSettings, newValue));
                setScale(scale - 0.05)
            }
        }
    }

    const setNewAspectRatio = (newAspectRatio: number, newWidthHeight: { width: number, height: number }) => {
        setAspectRatio(newAspectRatio);
        setWidthHeight(newWidthHeight);
        setIsAspectRatioChange(true)
        setScale(0);
    };

    const defaultSize: DefaultSize = ({ imageSize }) => {
        return {
            width: Math.min(imageSize.height, imageSize.width),
            height: Math.min(imageSize.width, imageSize.height)
        }
    }

    if (oldImage === '') {
        return
    }

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className='w-full h-full relative flex justify-center items-center bg-[#000000a0] cursor-move  overflow-hidden'>
                <div className='w-full h-full flex justify-center items-center' >
                    <FixedCropper
                        src={oldImage}
                        defaultSize={{width: 356, height: 353}}
                        ref={mergeRefs([cropperRef, cropper, saveCropperRef])}
                        className={'twitter-cropper'}
                        stencilProps={{
                            previewClassName: 'border-[5px] border-blue-300',
                            movable: false,
                            scalable: false,
                            lines: {},
                            handlers: {},
                            aspectRatio: aspectRatio,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                        stencilSize={{
                            width: widthHeight.width,
                            height: widthHeight.height,
                        }}
                        transitions={true}
                    />
                </div>
            </div>

            {/* starting of cropper tools */}
            <div className='w-full h-[70px] dark:bg-black bg-white px-2 flex rounded-[15px] '>
                <div className='w-[50%] h-full dark:bg-black bg-white px-4 flex justify-between items-center'>
                    <span onClick={() => { setNewAspectRatio(1 / 1, { width: 353, height: 353 }) }} className='w-[35px] h-[35px] relative postTools rounded-full   hover:bg-[#2f8bfc3c] flex justify-center items-center '>
                        <span className='w-[15px] h-[13px] border-[1px] border-[#2f8bfc] rounded-[3px] cursor-pointer ' />
                        <span className='postToolsText z-[5] flex justify-center items-center absolute -bottom-[25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                            original
                        </span>
                    </span>
                    <span onClick={() => { setNewAspectRatio(16 / 9, { width: 550, height: 303 }) }} className='w-[35px] h-[35px] relative postTools rounded-full   hover:bg-[#2f8bfc3c] flex justify-center items-center  '>
                        <span className='w-[15px] h-[10px] border-[1px] border-[#2f8bfc] rounded-[3px] cursor-pointer' />
                        <span className='postToolsText z-[5] flex justify-center items-center absolute -bottom-[25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                            wide
                        </span>
                    </span>
                    <span onClick={() => { setNewAspectRatio(1 / 1, { width: 353, height: 353 }) }} className='w-[35px] h-[35px] relative postTools rounded-full   hover:bg-[#2f8bfc3c] flex justify-center items-center '>
                        <span className='w-[15px] h-[15px] border-[1px] border-[#2f8bfc] rounded-[3px] cursor-pointer' />
                        <span className='postToolsText z-[5] flex justify-center items-center absolute -bottom-[25px] -left-[3px] w-[40px] h-[20px] text-white  text-[11px]  bg-[#2f8bfc] '>
                            square
                        </span>
                    </span>
                </div>

                <div className='w-[50%] h-full dark:bg-black bg-white flex justify-center items-center gap-[10px]'>
                    <div onClick={zoomOut} className="h-4 w-4 cursor-pointer fill-current text-gray-500 flex-shrink-0">
                        <HiMagnifyingGlassMinus />
                    </div>
                    <div className="flex justify-center  w-[200px] " style={{ margin: '0, auto' }}>
                        <CustomInputRange zoom={scale} onZoom={onZoom} />
                    </div>
                    <div onClick={zoomIn} className="h-4 w-4 cursor-pointer fill-current text-gray-500 flex-shrink-0">
                        <HiMagnifyingGlassPlus />
                    </div>
                </div>
            </div>
            {/* ending of cropper tools */}
        </div >
    )
}

export default ImageCropper;
