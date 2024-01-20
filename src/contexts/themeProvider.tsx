"use client"

import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
    themeMode: 'light',
    darkMode: () => { },
    lightMode: () => { },
});


export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [themeMode, setThemeMode] = useState('light');

    const darkMode = () => {
        setThemeMode('dark')

    };

    const lightMode = () => {
        setThemeMode('light');
    }
    useEffect(() => {
        const screenMode = localStorage.getItem('ScreenMode');
        setThemeMode(screenMode ? screenMode : themeMode)
        document.querySelector('html')?.classList.remove('dark', 'light');
        document.querySelector('html')?.classList.add(themeMode);


    }, [themeMode]);


    return (
        <ThemeContext.Provider value={{ themeMode, lightMode, darkMode }}>
            {children}
        </ThemeContext.Provider>
    )


}

