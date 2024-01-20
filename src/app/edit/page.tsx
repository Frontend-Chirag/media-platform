
import React from 'react';
import EditProfileForm from './components/EditProfileForm';



const EditProfile = () => {


    return (
        <div className='w-full h-full p-10 flex justify-center bg-[#fff] transition-all dark:bg-[#000] items-center'>
            <div className='w-full h-full custom-scrollbar   overflow-hidden overflow-y-auto flex flex-col justify-start items-center'>
                <h1 className='font-bold text-[34px]'>Edit Profile</h1>
                <EditProfileForm />
            </div>
        </div>
    )
};

export default EditProfile;