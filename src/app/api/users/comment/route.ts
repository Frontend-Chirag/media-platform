
import { Comment } from '@/Schemas/commentSchema';
import { Post } from '@/Schemas/postSchema';
import { uploadOnCloudinary } from '@/utils/cloudinary';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';


export async function POST(req: NextRequest) {
    try {

        const reqbody = await req.json();
        const { postId, userId, caption, media, parentPosts } = reqbody;


        for (let i = 0; i < media.length; i++) {
            const url = media[i].url;
            if (media[i].mediaType === 'image') {

                const imageData = await downloadMedia(url);
                const fileName = `image${i}`;
                const localPath = join('./public/temp', fileName);
                await writeFile(localPath, imageData);
                const imageUrl = await uploadOnCloudinary(localPath)
                media[i].url = imageUrl;
                console.log(`saved image to local ${imageUrl} ${media[i]} `)

            } else if (media[i].mediaType === 'video') {
                const videoData = await downloadMedia(url);
                const fileName = `video${i}`;
                const localPath = join('./public/temp', fileName);
                await writeFile(localPath, videoData);
                const videoUrl = await uploadOnCloudinary(localPath);
                media[i].url = videoUrl;
            }
        }

        const originalPost = await Post.findById(postId);

        const commentedPost = await Post.create({
            userId: userId,
            media: media,
            caption: caption,
            parentPosts: parentPosts,
            commenting: false,
            HideViewAndLike: false,
        });

        const savedCommentedPost = await commentedPost.save();

        originalPost.comments.push(savedCommentedPost._id);

        await originalPost.save();

        console.log(originalPost)

        return NextResponse.json({ id: originalPost._id, message: 'Successfully commented on a post' }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to comment on post' }, { status: 500 })
    }
}

async function downloadMedia(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    return Buffer.from(response.data)
}