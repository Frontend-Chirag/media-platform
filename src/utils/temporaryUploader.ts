// import { ImageType } from "@/components/ModelProvider";
// import { writeFile } from "fs/promises";
// import { join } from "path";

// export const temUploader = async (images: ImageType[]) => {
//     try {
        
//         for (let i = 0; i < images.length; i++) {
//            const imagePath = images[i].imagePath;
//            const bytes = await imagePath.arrayBuffer();
//            const buffer =  Buffer.from(bytes);

//            const path = join('.../public/temp', imagePath.name);
//            await writeFile(path, buffer);

//            console.log('file uploaded')
            
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

