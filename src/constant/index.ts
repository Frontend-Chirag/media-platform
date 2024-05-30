"use client";

import { useEffect, useState } from "react";
import { ReactStyleStateSetter } from '@/libs/usePost';
import toast from "react-hot-toast";
import { ImageType } from "@/components/ModelProvider";


export const timeAgo = (timestamp: string | number | Date): string => {
    const currentDate = new Date();
    const previousDate = new Date(timestamp);

    const seconds = Math.floor((currentDate.getTime() - previousDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ago`;
    } else if (hours > 0) {
        return `${hours}h ago`;
    } else if (minutes > 0) {
        return `${minutes}m ago`;
    } else {
        return `${seconds}s ago`;
    }
};

export const formatMinutes = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes} min ${formattedSeconds} sec`;
};

export const useDebounce = <T>(value: T, delay = 800) => {
    const [debounce, setDebounce] = useState<T>(value);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDebounce(value)
        }, delay);

        return () => clearTimeout(timeOut)
    }, [value, delay]);

    return debounce
}

export const postTiming = (data: Date) => {
    const createdAt = new Date(data);

    // Get the hour and minute in 12-hour format
    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Get the month name and day of the month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[createdAt.getMonth()];
    const dayOfMonth = createdAt.getDate();

    // Get the year
    const year = createdAt.getFullYear();

    // Construct the formatted string
    const formattedCreatedAt = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amOrPm} · ${monthName} ${dayOfMonth}, ${year}`;

    return formattedCreatedAt

};

export const profressionCategory = [
    "Entertainment & Recreation",
    "Event Venue",
    "Dance & Night Club",
    "Automotive",
    "Aviation",
    "Marine",
    "Beauty, Cosmetic & Personal Care",
    "Commercial & Industrial",
    "Education",
    "Financial Services",
    "Restaurant",
    "Hotel & Lodging",
    "Home & Garden",
    "Professional Services",
    "Advertising & Marketing Agency",
    "Lawyer & Law Firm",
    "Media & News Company",
    "Medical & Health",
    "Non - Governmental & Nonprofit Organization ",
    "Real Estate",
    "Science & Technology",
    "Shopping & Retail",
    "Fashion Company ",
    "Sports, Fitness & Recreation",
    "Travel & Transportation",
    "Other",
    "Media Personality",
    "Social Media Influencer",
    "Social Media Influencer",
    "Musician",
    "Journalist",
    "Entrepreneur",
    "Mobile Application",
    "Community",
    "3D Artist (or) 3D Designer",
    "Actor",
    "Artist",
    "Attorney",
    "Author",
    "Baker",
    "Banker",
    "Barber",
    "Bartender",
    "Biologist",
    "Brewer",
    "Butcher",
    "Carpenter",
    "Chef",
    "Chemist",
    "Chiropractor",
    "Clerk",
    "Coach",
    "Composer",
    "Consultant",
    "Contractor",
    "Dancer",
    "Dentist",
    "Designer",
    "Detective",
    "Doctor",
    "Driver",
    "Economist",
    "Electrician",
    "Engineer",
    "Entrepreneur",
    "Farmers",
    "Firefighter",
    "Fisherman",
    "Florist",
    "Geologist",
    "Hairdresser",
    "Historian",
    "Insurance Agent",
    "Interpreter",
    "Janitor",
    "Journalist",
    "Judge",
    "Lawyer",
    "Librarian",
    "Linguist",
    "Manager",
    "Mechanic",
    "Musician",
    "Nurse",
    "Optometrist",
    "Painter",
    "Pharmacist",
    "Photographer",
    "Physician",
    "Pilot",
    "Plumber",
    "Police Officer",
    "Professor",
    "Psychologist",
    "Real Estate Agent",
    "Scientist",
    "Sculptor",
    "Secretary",
    "Singer",
    "Social Worker",
    "Software Application",
    "Software Company",
    "Software developer/Programmer/Software engineer",
    "Soldier",
    "Statistician",
    "Surgeon",
    "Teacher",
    "Technician",
    "Translator",
    "Travel Agent",
    "Truck Driver",
    "Veterinarian",
    "Waiter/Waitress",
    "Web Developer",
    "Welder",
    "Writer",
    "Yoga Instructor",
    "Zoologist"
];

interface IUsehandleImages {
    e: React.ChangeEvent<HTMLInputElement>;
    media: ImageType[];
    setCurrentIndex: (input: number) => void;
    setMedia: (newArrorSetterFn: ReactStyleStateSetter<ImageType[]>) => void
}

export const handleImages = ({ e, media, setCurrentIndex, setMedia }: IUsehandleImages) => {

    if (e.target.files && e.target.files.length > 0 && media.length <= 5) {
        const newFile = e.target.files[0];
        if (newFile.type.startsWith('image/') || newFile.type.startsWith('video/')) {

            if (newFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const dataUrl = event.target?.result;
                    setMedia((prev) => [...prev, { url: dataUrl, mediaType: 'image', tags: [] }]);;
                    if (media.length > 0) {
                        setCurrentIndex(media.length - 1);
                    }
                }

                reader.readAsDataURL(newFile)
            } else if (newFile.type.startsWith('video/')) {
                const videoElement = document.createElement('video');
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const dataUrl = event.target?.result;
                    videoElement.src = dataUrl?.toString()!;
                    videoElement.onloadedmetadata = () => {
                        if (videoElement.duration > 45) {
                            toast.error('Video should be less than 45 sec')
                        } else {
                            setMedia((prev) => [...prev, { url: dataUrl, mediaType: 'video', tags: [] }]);
                            if (media.length > 0) {
                                setCurrentIndex(media.length - 1);
                            }
                        }
                    }

                }

                reader.readAsDataURL(newFile)
            }


        } else {
            toast.error('Invalid File Type')
        }
    } else if (media.length >= 5) {
        toast.error('Limit of uploading Images or videos should be less than 5')
    }
};

export const handleComments = async () => {

}
