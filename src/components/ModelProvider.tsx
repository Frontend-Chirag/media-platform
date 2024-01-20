import React from 'react'

import SettingModel from './SettingModel';
import LoadingModel from './LoadingModel';
import UploadImageModel from './UploadImageModel';
import EditNameUsernameBioModel from './EditNameUsernameBioModel';
import EditProfilePopupModel from './EditProfilePopupModel';
import PrivacyModel from './PrivacyModel';
import UnfollowButtonModel from './UnfollowButtonModel';
import NewAccessTokenButton from './NewAccessTokenButton';
import Notification from './Notification';


interface ModelProviderProps {
    children: React.ReactNode;
}

const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {

    return (
        <div className='w-full h-full flex col-auto '>
            <SettingModel />
            <LoadingModel />
            <UploadImageModel />
            <EditProfilePopupModel />
            <EditNameUsernameBioModel />
            <UnfollowButtonModel/>
            <PrivacyModel />
            <NewAccessTokenButton/>
            <Notification />
            {children}
        </div>
    )
}

export default ModelProvider