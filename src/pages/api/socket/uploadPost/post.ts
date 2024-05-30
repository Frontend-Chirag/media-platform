import { NextApiRequest, NextApiResponse } from 'next';
import { Post } from '@/Schemas/postSchema';
import { uploadMultipleFileOnCloudinary } from '@/utils/cloudinary';
import { join } from 'path';
import { writeFile } from 'fs/promises';


export default async function POST(req: NextApiRequest, res: NextApiResponse) {

    try {
        const reqBody = req.body

        const { userId, media, audio, caption, imagePath } = reqBody;

       console.log(imagePath)
        // console.log('media', media)
        // if (media && Array.isArray(media)) {
        //     console.log('its an Array')
        //     for (let i = 0; i < media.length; i++) {
        //         console.log('loop')
        //         if (media[i]?.type === 'image' || media[i]?.type === 'video') {
        //             console.log('loop if') 
        //             const imagePath = media[i].imagePath;

                    // Convert the file to a buffer
                    // const bytes = await imagePath.arrayBuffer();
                  
                    // const buffer = Buffer.from(bytes);
                
                    // Save the file to a temporary location
                    // const path = join('./public/temp', media[i].imagePath.name);
                    // await writeFile(path, buffer);
                    // const upload = await uploadMultipleFileOnCloudinary(media);

        //         }
        //     }
        // } else {
        //     console.log('media is not an array')
        // }

        // console.log(upload)

        return res.status(200).json({ message: 'Post upload Successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to upload Post' });
    }

}