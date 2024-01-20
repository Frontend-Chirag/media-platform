"use client";

import { useUser } from '@/libs/useUser';
import { SocketContextType } from '@/types/type';
import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIo } from 'socket.io-client';


// Create the socket context with default values
const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

// Define a custome hook to use the socket context
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    // Define the state varibale for the socket and connection status
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useUser();


    // Use an effet to create the socket instance and handle connection events
    useEffect(() => {
        // Create the socket instance
        const socketInstance = new (ClientIo as any)('http://localhost:3000', {
            path: '/api/socket/io',
            addTrailingSlash: false,
            auth: {
                userId: user?._id
            }
        });

        // Handle the "connect" event
        socketInstance.on("connect", () => {
            setIsConnected(true);
            console.log("connected");

        });

        socketInstance.on('message', (message: any) => {
            console.log('room connection', message)
        })

        // Handle the "disconnect" event
        socketInstance.on("disconnect", () => {
            setIsConnected(false);
            console.log("disconnected")
        });

        // Set the socket instance in state
        setSocket(socketInstance);

        // Clean up the effect by disconnection the socket when the component unmount
        return () => {
            socketInstance.disconnect();
        }
    }, [user]);

    // Render the SocketContext.Provider component with the socket and connection status    
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}



