import { create } from 'zustand';

interface IUseAudioModelProps {
    isAudioModel: boolean;
    isAudioTrimModel: boolean;
    onAudioModelOpen: () => void;
    onAudioModelClose: () => void;
    onAudioTrimModelOpen: () => void;
    onAudioTrimModelClose: () => void;
    AudioContent: {
        url: string,
        image: string,
        title: string,
        artist: string,
    },
    setAudioContent: (
        url: string,
        image: string,
        title: string,
        artist: string,
    ) => void;
    trimAudioContent: {
        url: string,
        title: string,
        artist: string,
        startTime: number,
        endTime: number
    };
    setTrimAudioContent: (
        url: string,
        title: string,
        artist: string,
        startTime: number,
        endTime: number,
    ) => void;
}

export const useAudioModel = create<IUseAudioModelProps>((set) => ({
    isAudioModel: false,
    isAudioTrimModel: false,
    onAudioModelOpen: () => set({ isAudioModel: true }),
    onAudioModelClose: () => set({ isAudioModel: false }),
    onAudioTrimModelOpen: () => set({ isAudioTrimModel: true }),
    onAudioTrimModelClose: () => set({ isAudioTrimModel: false }),
    AudioContent: {
        url: '',
        image: '',
        title: '',
        artist: '',
    },
    setAudioContent: (
        url: string,
        image: string,
        title: string,
        artist: string,
    ) => set({ AudioContent: { url: url, image: image, title: title, artist: artist, } }),
    trimAudioContent: {
        url: '',
        title: '',
        artist: '',
        startTime: 0,
        endTime: 0,
    },
    setTrimAudioContent: (
        url: string,
        title: string,
        artist: string,
        startTime: number,
        endTime: number
    ) => set({ trimAudioContent: { url: url, title: title, artist: artist, startTime: startTime, endTime: endTime } }),

}))