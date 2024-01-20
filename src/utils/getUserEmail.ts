
import { create } from 'zustand';

interface IuserEmail {
    useremail : string;
    userverificationToken: string;
    setEmail: (email: string) => void;
    setVerificationToken: (verificationToken: string) => void;
}

export const useUserEmail = create<IuserEmail>((set) => ({
    useremail: '',
    userverificationToken:'',
    setEmail: (useremail: string) => set({useremail: useremail }),
    setVerificationToken: (userverificationToken: string) => set({userverificationToken: userverificationToken }),
}))
