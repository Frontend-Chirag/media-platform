
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import axios from "axios";

import { ConnectedToDatabase } from "@/DB/databaseConnection";
import { Post } from "@/Schemas/postSchema";
import { User } from "@/Schemas/userSchema";
import { uploadOnCloudinary } from "@/utils/cloudinary";



export async function POST(req: NextRequest) {
    try {

        await ConnectedToDatabase();

        const reqBody = await req.json();

        const { userId, caption, audio, media } = reqBody;

        for (let i = 0; i < media.length; i++) {
            const url = media[i].url;
            if (media[i].mediaType === 'image') {

                const imageData = await downloadMedia(url);
                const fileName = `image${i}`;
                const localPath = join('./public/temp', fileName);
                await writeFile(localPath, imageData);
                const imageUrl = await uploadOnCloudinary(localPath)
                media[i].url = imageUrl;
                console.log('saved image to local')

            } else if (media[i].mediaType === 'video') {
                const videoData = await downloadMedia(url);
                const fileName = `video${i}`;
                const localPath = join('./public/temp', fileName);
                await writeFile(localPath, videoData);
                const videoUrl = await uploadOnCloudinary(localPath);
                media[i].url = videoUrl;
            }
        }


        const newPost = await Post.create({
            userId: userId,
            media: media,
            audio: audio,
            caption: caption,
            commenting: false,
            HideViewAndLike: false,
            isPinned: false
        });

       await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    posts: {
                        postId: newPost._id,
                        isRepost: false,
                        createdAt: Date.now()
                    }
                }
            },
            { new: true }
        );

        return NextResponse.json({ id: userId, message: 'Upload post successfully' }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to Upload post' }, { status: 500 })
    }
};


 async function downloadMedia(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    return Buffer.from(response.data)
}
