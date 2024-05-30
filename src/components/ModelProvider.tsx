"use client";

import React, { useState } from 'react'

import SettingModel from './SettingModel';
import LoadingModel from './LoadingModel';
import UploadImageModel from './UploadImageModel';
import PrivacyModel from './PrivacyModel';
import UnfollowButtonModel from './UnfollowButtonModel';
import NewAccessTokenButton from './NewAccessTokenButton';
import Notification from './Notification';
import NotitificationPremission from './NotitificationPremission';
import MobileSettingModel from './MobileSettingModel';
import GIFPickerContainer from './GIFPickerContainer';
import PostImageCropper from './PostImageCropper';
import AudioComponent from './AudioComponent';
import PostSongsList from './PostSongsList';
import { TaggedUserprops } from './Tags';
import PostCard from './PostCard';
import UploadLoader from '@/Loaders/UploadLoader';
import EditProfile from './EditProfile';
import ReplyContainer from './ReplyContainer';
import NewMessageUserSearch from './NewMessageUserSearch';


interface ModelProviderProps {
    children: React.ReactNode;
}

export interface ImageType {
    url: string | ArrayBuffer | null | undefined;
    mediaType: 'image' | 'video' | 'gif'
    tags: TaggedUserprops[];
}

const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {

    return (
        <div className='w-full h-full flex col-auto '>
            <SettingModel />
            <MobileSettingModel />
            <LoadingModel />
            <UploadImageModel />
            <EditProfile />
            <UnfollowButtonModel />
            <PrivacyModel />
            <NewAccessTokenButton />
            <NotitificationPremission />
            <Notification />
            <GIFPickerContainer />
            <PostImageCropper />
            <AudioComponent />
            <PostSongsList />
            <PostCard />
            <UploadLoader />
            <ReplyContainer />
            <NewMessageUserSearch/>
            {children}

        </div>
    )
}

export default ModelProvider