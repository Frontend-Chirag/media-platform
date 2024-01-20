import { NextResponse } from 'next/server';
import mongoose from "mongoose";
import { DB_NAME } from '@/constant/index'

export async function ConnectedToDatabase() {
    try {

        const connection = await mongoose.connect(`${process.env.MONGODB_URI!}/${DB_NAME}`)

        if (connection) {
            console.log(`Connected to database ${DB_NAME}`);
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error connecting to database' }, { status: 500 })
    }
}