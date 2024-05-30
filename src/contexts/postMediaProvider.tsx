// "use client";

// import { ImageType } from "@/components/ModelProvider";
// import React, { createContext, useState } from "react";


// export const PostMediaContext = createContext({
//     media: [],
//     setMedia: React.useState<ImageType[]>([])
// })

// interface IUsePostMediaProvider {
//     children: React.ReactNode;
// }

// const PostMediaProvider: React.FC<IUsePostMediaProvider> = ({ children }) => {
//     const [media, setMedia] = useState<ImageType[]>([]);
//     const [currentIndex, setCurrentIndex] = useState<number>(0);


//     return (
//         <PostMediaContext.Provider media={media} setMedia={setMedia}>
//             {children}
//         </PostMediaContext.Provider>
//     )
// }