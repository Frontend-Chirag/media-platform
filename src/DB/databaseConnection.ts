import { NextResponse } from 'next/server';
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
}

const connection: ConnectionObject = {};

export const DB_NAME = 'socialMediaDB';

export async function ConnectedToDatabase(): Promise<void> {

    if(connection.isConnected){
        console.log('Already connected to database');
        return 
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI!}/socialMediaDB`);
 
        connection.isConnected = db.connections[0].readyState;

        console.log('DB connected successfully')

    } catch (error) {
        console.log("Database connection Failed",error);

        process.exit(1);
    }
}