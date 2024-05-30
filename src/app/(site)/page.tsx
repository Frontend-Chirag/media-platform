"use client";

import { ImageType } from "@/components/ModelProvider";
import Post from "@/components/Post";
import { useState } from "react";



export default function Home() {
  const [media, setMedia] = useState<ImageType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (

    <div className=' w-full h-full flex  transition-all  bg-[#fff] dark:bg-[#000] '>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-auto border-b-[1px] border-b-neutral-400">
          <Post
            media={media}
            setMedia={setMedia}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            PostType={"CreatePost"}
          />
        </div>
      </div>

    </div>
  )
}
