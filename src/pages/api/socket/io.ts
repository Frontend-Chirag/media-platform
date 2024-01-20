import { NextApiResponseServerIo } from '@/types';
import jwt from 'jsonwebtoken';
import { Server as NetServer } from 'http';
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";

// Configure the Next.js API route to disable the built-in parser
export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        // Check if the socket.io server instance is not already attached to the HTTP server
        if (!res.socket.server.io) {
            const token = req.cookies.accessToken || '';

            if (!token) {
                // Return a 401 status code for unauthorized requests
                return res.status(401).json({ message: 'Unauthorized request' });
            }

            // Decode the token to get the user ID
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
            const userId = decodedToken?._id;

            if (!userId) return;

            // Define the path for the socket.io
            const path = '/api/socket/io';

            // Get the HTTP server instance from the response's socket
            const httpServer: NetServer = res.socket.server as any;

            // Create a new socket.io server instance with the HTTP server and path
            const io = new ServerIo(httpServer, {
                path: path,
                addTrailingSlash: false,
                pingTimeout: 6000,
                maxHttpBufferSize: 1e8,
                connectionStateRecovery: {
                    maxDisconnectionDuration: 2 * 60 * 1000,
                },
            });

            // Attach the socket.io server instance to the HTTP server
            res.socket.server.io = io;

            io.on('connect', (socket) => {
                // Get the user ID from the socket handshake
                const userId = socket.handshake.auth.userId;

                // Join the socket room based on the user ID
                socket.join(userId);

                // Emit a message indicating that the user has connected
                io.to(userId).emit('message', `${userId} connected`);
            });

            console.log("Socket is initializing");
        } else {
            console.log("Socket is already connected");
        }

        // Return a success message with a 200 status code
        res.status(200).json({ message: 'Connected successfully with socket' });

        // End the response
        res.socket.end();
    } catch (error) {
        console.log(error);
        // Return a 500 status code for internal server error
        res.status(500).json({ message: 'Failed connection with socket' });
    }
};

export default ioHandler;
