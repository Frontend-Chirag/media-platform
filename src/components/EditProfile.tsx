"use client"

import { profressionCategory } from "@/constant";
import { useTheme } from "@/contexts/themeProvider";
import { IUseDob, useEditModel } from "@/libs/useEditModel";
import { useUser } from "@/libs/useUser";
import { useEditProfile } from "@/queries/quriesAndmutations";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { IoIosCheckmark } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TbCameraPlus } from "react-icons/tb";
import { ClipLoader } from "react-spinners";

export interface IUseInputEditData {
    name: string | undefined;
    bio: string | undefined;
    location: string | undefined;
    link: string | undefined;
    backgroundImage: string | ArrayBuffer | null | undefined;
    profilePicture: string | ArrayBuffer | null | undefined;
    profession: string | undefined;
    dob: IUseDob | undefined
}

const EditProfile = () => {

    const { isEditProfile, editFromData, setIsEditProfile, setEditFromData } = useEditModel();
    const { themeMode } = useTheme();
    const { user, setUser } = useUser();

    const { mutateAsync: editProfile, data } = useEditProfile(user?._id!);

    const [scrollHeight, setScrollHeight] = useState<number>(0);

    const [months] = useState([
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]);
    const [dates, setDates] = useState(() => {
        const date = new Date();
        const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const dateOptions = [];
        for (let i = 1; i <= totalDays; i++) {
            dateOptions.push(i);
        }
        return dateOptions;
    });
    const [years, setYears] = useState(() => {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        for (let i = currentYear - 95; i <= currentYear; i++) {
            yearOptions.push(i);
        }
        return yearOptions;
    });
    const backgroundImageRef = useRef<HTMLInputElement | null>(null);
    const profilePicture = useRef<HTMLInputElement | null>(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [editDob, setEditDob] = useState(false);
    const [professionArray, setProfessionArray] = useState([...profressionCategory]);
    const [professionSearchTerm, setProfessionSearchTerm] = useState('');
    const [editProfession, setEditProfession] = useState(false);
    const [inputEditData, setInputEditData] = useState<IUseInputEditData>({
        name: '',
        bio: '',
        location: '',
        link: '',
        backgroundImage: '',
        profilePicture: '',
        profession: '',
        dob: {
            date: '',
            month: '',
            year: ''
        }
    });

    useEffect(() => {
        setInputEditData(editFromData!);
    }, [editFromData])

    useEffect(() => {
        const statusContainer = document.getElementById('editContainer');

        statusContainer?.addEventListener('scroll', () => {
            const windowHeight = statusContainer.scrollTop;
            setScrollHeight(windowHeight);
        })

        return () => {
            statusContainer?.removeEventListener('scroll', () => {
                const windowHeight = statusContainer.scrollTop;
                setScrollHeight(windowHeight);
            })
        }

    }, [scrollHeight]);

    const handleSearchProfessionCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setProfessionSearchTerm(term);
    };

    useEffect(() => {
        if (professionSearchTerm) {

            const searchResults = profressionCategory.filter((profession) =>
                profession.toLowerCase().includes(professionSearchTerm.toLocaleLowerCase())
            );
            setProfessionArray(searchResults);
        } else {
            setProfessionArray([...profressionCategory]);

        }
    }, [professionSearchTerm]);

    const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = e.target.value;
        setInputEditData({
            ...inputEditData, dob: {
                month: selectedMonth.toString(),
                date: inputEditData?.dob?.date,
                year: inputEditData?.dob?.year
            }
        })
        const date = new Date();
        date.setMonth(months.indexOf(selectedMonth));
        const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const updatedDates = [];
        for (let i = 1; i <= totalDays; i++) {
            updatedDates.push(i);
        }
        setDates(updatedDates);
    };

    const handleEditProfession = () => {
        const statusContainer = document.getElementById('editContainer');
        if (statusContainer?.scrollTop) {
            statusContainer.scrollTop = 0
        }

        setEditProfession(true);
        if (inputEditData?.profession) {
            setProfessionArray([
                inputEditData?.profession,
                ...professionArray.filter((profession) => profession !== inputEditData.profession)
            ])
        }
    };

    const handleBackgroundImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {

            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = async (event) => {
                const dataUrl = event.target?.result;
                setInputEditData({ ...inputEditData, backgroundImage: dataUrl })
            }

            reader.readAsDataURL(file)
        }
    };

    const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const dataUrl = event.target?.result;
                setInputEditData({ ...inputEditData, profilePicture: dataUrl })
            };

            reader.readAsDataURL(file)
        }
    };

    const handleProfessionType = (selectedProfession: string) => {
        const statusContainer = document.getElementById('editContainer');
        if (statusContainer?.scrollTop) {
            statusContainer.scrollTop = 0
        }
        setInputEditData({ ...inputEditData, profession: selectedProfession });
        setProfessionArray([
            selectedProfession,
            ...professionArray.filter((profession) => profession !== selectedProfession)
        ])
    };

    const handlebackEdit = () => {
        if (editProfession) {
            setEditProfession(false)
        } else {
            setEditFromData(null), setIsEditProfile(false)
            setIsSaveLoading(false)
            setEditProfession(false)
        }
    };

    const handleSaveEdit = async () => {

        const profilePicture = inputEditData.profilePicture as string;
        const isUploaded = (profilePicture && profilePicture.startsWith('http://res.cloudinary.com') ? true : false)
        const backgroundImage = inputEditData.backgroundImage as string;
        const isbackgroundImageUploaded = (backgroundImage && backgroundImage.startsWith('http://res.cloudinary.com') ? true : false)

        try {
            setIsSaveLoading(true)
            await editProfile({
                data: {
                    profilePicture: {
                        url: inputEditData.profilePicture as string,
                        isUploaded: isUploaded
                    },
                    name: inputEditData.name,
                    bio: inputEditData.bio,
                    location: inputEditData.location,
                    link: inputEditData.link,
                    backgroundImage: {
                        url: inputEditData.backgroundImage as string,
                        isUploaded: isbackgroundImageUploaded
                    },
                    profession: inputEditData.profession,
                    dob: inputEditData.dob
                },
                userId: user?._id!
            })
            console.log('updated profile', data)
            setIsSaveLoading(false)
            setIsEditProfile(false)
            setEditFromData(null)
            setEditProfession(false)
        } catch (error: any) {
            console.log(error);
            throw new Error(error)
        }
    };

    return (
        <div className={`absolute top-0 left-0 bg-[#2f8bfc3c] w-full h-full z-[999] ${isEditProfile ? 'flex' : 'hidden'} justify-center items-center `}>
            <div id='editContainer' className='w-full h-full md:w-[600px] md:h-[600px] relative bg-white dark:bg-black md:rounded-[15px] flex flex-col overflow-hidden overflow-y-auto'>
                <div
                    style={{
                        background: `${themeMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)'}`,
                        boxShadow: '0, 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        backdropFilter: 'blur(14px)',

                    }}
                    className={`w-full  py-3  ${scrollHeight > 70 ? 'sticky top-0 left-0 z-[99]' : 'relative'} flex justify-between text-xl font-bold items-center px-4 gap-6 `}>
                    <div className='flex justify-center items-center '>
                        <FaArrowLeft
                            onClick={handlebackEdit}
                            className='text-[#2f8bfc] cursor-pointer text-2xl'
                        />
                        <div className='flex flex-col text-start leading-3 fontsfamily ml-4'>
                            <h3 className='text-[18px] text-white font-bold'>
                                {editProfession ? 'Edit Profession' : 'Edit Profile'}
                            </h3>
                        </div>
                    </div>
                    {!editProfession &&
                        (isSaveLoading
                            ?
                            <ClipLoader size={25} loading color='#2f8bfc' />
                            :
                            <button
                                onClick={handleSaveEdit}
                                className={`px-3 py-1 bg-[#2f8bfc] text-white text-[15px] font-normal border-none outline-none  rounded-2xl`}>
                                Save
                            </button>
                        )
                    }
                </div>
                {!editProfession
                    ? <div className="w-full h-auto flex flex-col">
                        <div className='w-full h-auto flex justify-center items-center  bg-gray-400 dark:bg-neutral-800'>
                            <div className='w-[170px] h-[170px] relative'>
                                <Image
                                    src={inputEditData?.backgroundImage as string ? inputEditData?.backgroundImage as string : '/profile-circle.svg'}
                                    fill
                                    alt='image'
                                    objectFit='cover'
                                />
                                <div className="w-full h-full absolute bg-[#0000001c] z-[10] top-0 left-0 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => backgroundImageRef.current?.click()}
                                        className='w-[50px] h-[50px] flex justify-center items-center text-2xl bg-[#000000aa] hover:bg-[#0000009d] rounded-full text-black dark:text-white'>
                                        <TbCameraPlus />
                                    </button>
                                    <button
                                        onClick={() => { setInputEditData({ ...inputEditData, backgroundImage: '' }) }}
                                        className='w-[50px] h-[50px] flex justify-center items-center text-2xl bg-[#000000aa] hover:bg-[#0000007d] rounded-full text-black dark:text-white'>
                                        <FaTimes />
                                    </button>
                                    <input ref={backgroundImageRef} className="hidden" type="file" accept="image/*" onChange={(e) => handleBackgroundImage(e)} />
                                </div>
                            </div>
                        </div>

                        <div className='w-full h-[100px]  relative'>
                            <div className='w-[140px] h-[140px] absolute top-[-70px] left-[20px] overflow-hidden rounded-full border-4 dark:border-black border-white'>
                                <div className='w-full h-full relative '>
                                    <Image
                                        src={inputEditData?.profilePicture as string ? inputEditData?.profilePicture as string : '/profile-circle.svg'}
                                        fill
                                        alt='profile'
                                        className='object-cover'
                                    />
                                </div>
                                <div className="w-full h-full bg-[#0000001c] absolute z-[10] top-0 left-0 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => { profilePicture.current?.click() }}
                                        className='w-[50px] h-[50px] flex justify-center items-center text-2xl bg-[#000000aa] hover:bg-[#0000009d] rounded-full text-black dark:text-white'>
                                        <TbCameraPlus />
                                    </button>
                                </div>
                                <input ref={profilePicture} className="hidden" type="file" accept="image/*" onChange={(e) => handleProfilePicture(e)} />

                            </div>
                        </div>

                        <div className='w-full h-auto flex flex-col p-4 gap-8 '>
                            <div className={`w-full select-input h-auto `}>
                                <div className="w-full h-auto  px-2 absolute top-2 left-0 z-[1] flex justify-between items-center">
                                    <p className={`text-[15px] text-gray-200 absolute-content dark:text-neutral-400 fontsfamily`}>Name</p>
                                    <p className={`text-[15px]  'text-gray-200 dark:text-neutral-400  fontsfamily`}>{inputEditData?.name?.length}/50</p>
                                </div>
                                <input
                                    value={inputEditData?.name && inputEditData.name!}
                                    onChange={(e) => setInputEditData({ ...inputEditData, name: e.target.value })}
                                    type="text"
                                    className='w-full h-[70px] text-[18px] px-2 pt-[20px] border-[1px]  rounded-md border-gray-400 dark:border-neutral-600 bg-white dark:bg-black  outline-none dark:text-white text-black '
                                />
                            </div>
                            <div className={`w-full select-input h-auto `}>
                                <div className="w-full h-auto  px-2 absolute top-2 left-0 z-[1] flex justify-between items-center">
                                    <p className={`text-[15px]  text-gray-200 absolute-content dark:text-neutral-400 fontsfamily`}>Bio</p>
                                    <p className={`text-[15px]  text-gray-200 dark:text-neutral-400  fontsfamily`}>{inputEditData?.bio?.length}/100</p>
                                </div>
                                <textarea
                                    value={inputEditData?.bio && inputEditData.bio!}
                                    onChange={(e) => setInputEditData({ ...inputEditData, bio: e.target.value })}
                                    className='w-full h-[100px] text-[18px]  px-2 pt-[40px] resize-none border-[1px]  rounded-md border-gray-400 dark:border-neutral-600 bg-white dark:bg-black  outline-none dark:text-white text-black'
                                />
                            </div>
                            <div className={`w-full select-input h-auto `}>
                                <div className="w-full h-auto  px-2 absolute top-2 left-0 z-[1] flex justify-between items-center">
                                    <p className={`text-[15px] text-gray-200 absolute-content dark:text-neutral-400 fontsfamily`}>Location</p>
                                </div>
                                <input
                                    value={inputEditData?.location && inputEditData.location!}
                                    onChange={(e) => setInputEditData({ ...inputEditData, location: e.target.value })}
                                    type="text"
                                    className='w-full h-[70px] text-[18px] px-2 pt-[20px]  border-[1px]  rounded-md border-gray-400 dark:border-neutral-600 bg-white dark:bg-black  outline-none dark:text-white text-black '
                                />
                            </div>
                            <div className={`w-full select-input h-auto `}>
                                <div className="w-full h-auto  px-2 absolute top-2 left-0 z-[1] flex justify-between items-center">
                                    <p className={`text-[15px] text-gray-200 absolute-content dark:text-neutral-400 fontsfamily`}>Website</p>
                                </div>
                                <input
                                    value={inputEditData?.link && inputEditData.link!}
                                    onChange={(e) => setInputEditData({ ...inputEditData, link: e.target.value })}
                                    type="text"
                                    className='w-full h-[70px] text-[18px] px-2 pt-[20px]  border-[1px]  rounded-md border-gray-400 dark:border-neutral-600 bg-white dark:bg-black  outline-none dark:text-white text-black '
                                />
                            </div>
                            <div className="w-full h-auto flex flex-col justify-start items-start">
                                <p className="flex justify-center items-center text-[15px] text-gray-400 dark:text-neutral-400 gap-1">Birth Date .
                                    <span
                                        onClick={() => { setEditDob(!editDob) }}
                                        className="text-[#2f8bfc] cursor-pointer">
                                        {editDob ? ' Cancel' : ' Edit'}
                                    </span>
                                </p>
                                {!editDob &&
                                    <p className="text-[18px] text-black dark:text-white">{!inputEditData?.dob ? 'Add your date of Birth' : `${inputEditData?.dob?.date} ${inputEditData?.dob?.month} ${inputEditData?.dob?.year}`}</p>
                                }
                                {editDob &&
                                    <div className="w-full h-auto mt-2 gap-2 flex justify-center items-center ">
                                        <div className="select-container w-auto h-auto">
                                            <select
                                                value={inputEditData?.dob?.month && inputEditData?.dob?.month}
                                                className="w-[295px] h-[70px] px-2 flex justify-center items-center rounded-md border-[1px] border-gray-400 dark:border-neutral-600 focus:border-[#2f8bfc] outline-none bg-black gap-2 text-white text-[18px] "
                                                onChange={(e) => handleMonthChange(e)}>
                                                {months.map((month) => (
                                                    <option className="px-2" value={month} key={month}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="select-container w-auto h-auto">
                                            <select
                                                value={inputEditData?.dob?.date && inputEditData?.dob?.date}
                                                onChange={(e) => {
                                                    setInputEditData({
                                                        ...inputEditData, dob: {
                                                            month: inputEditData?.dob?.month,
                                                            date: e.target.value.toString(),
                                                            year: inputEditData?.dob?.year
                                                        }
                                                    })
                                                }}
                                                className="w-[100px] h-[70px] px-2 flex justify-center items-center rounded-md border-[1px] border-gray-400 dark:border-neutral-600 focus:border-[#2f8bfc] outline-none bg-black  gap-2 text-white text-[18px] "
                                            >
                                                {dates.map((date, index) => (
                                                    <option className="px-2" key={index} value={date}>{date}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="select-container w-auto h-auto">
                                            <select
                                                value={inputEditData?.dob?.year && inputEditData?.dob?.year}
                                                onChange={(e) => {
                                                    setInputEditData({
                                                        ...inputEditData, dob: {
                                                            month: inputEditData?.dob?.month,
                                                            date: inputEditData?.dob?.date,
                                                            year: e.target.value.toString()
                                                        }
                                                    })
                                                }}
                                                className="w-[140px] h-[70px] px-2 flex justify-center items-center rounded-md border-[1px] border-gray-400 dark:border-neutral-600 focus:border-[#2f8bfc] outline-none bg-black  gap-2 text-white text-[18px] "
                                            >
                                                {years.map((year, index) => (
                                                    <option className="px-2" key={index} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div onClick={handleEditProfession} className="w-full px-4 h-[50px] mb-4 flex cursor-pointer justify-between items-center text-[18px] text-black dark:text-white bg-white dark:bg-black hover:bg-gray-400 dark:hover:bg-neutral-800">
                            <p>Edit professional profile</p>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                    </div>
                    : <div className="w-full h-auto flex flex-col justify-start gap-4 items-center px-5 py-3">
                        <p className="text-[20px] bg-black dark:bg-white text-white dark:text-black font-bold fontsfamily px-5 py-3 rounded-[25px] ">
                            Choose Profession category
                        </p>
                        <input type='text' onChange={(e) => handleSearchProfessionCategory(e)} value={professionSearchTerm} className="w-[400px] px-4 h-[50px] border-[1px] border-gray-400  dark:border-neutral-700 focus:border-[#2f8bfc] outline-none text-[#2f8bfc] rounded-[25px] placeholder:text-neutral-400 bg-white dark:bg-black" placeholder="Search" />
                        <div className="w-full h-auto flex flex-col px-2 gap-1">
                            {professionArray.length === 0
                                ? <p className="text-gray-400 dark:text-neutral-400 text-[18px] fontsfamily">No Such Profession found</p>
                                : (professionArray.map((type, index) => (
                                    <div onClick={() => handleProfessionType(type)} className="w-full h-[40px] px-2 py-1 bg-white dark:bg-black  flex justify-between items-center text-black dark:text-white text-[18px] fontsfamily" key={index}>
                                        <p>{type}</p>
                                        <div className={`w-[30px] cursor-pointer h-[30px] border-[1px] ${inputEditData.profession === type && 'bg-[#2f8bfc]'}  border-gray-400 dark:border-neutral-700 overflow-hidden flex justify-center items-center rounded-full`}>
                                            {inputEditData.profession === type &&
                                                <IoIosCheckmark className="text-white text-[40px]" />
                                            }
                                        </div>
                                    </div>
                                ))
                                )
                            }
                        </div>
                    </div>
                }

            </div>
        </div>
    )

};

export default EditProfile;
