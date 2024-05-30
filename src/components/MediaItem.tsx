import useLoadImage from "@/supabasehook/useLoadImage";
import { useLoadSong } from "@/supabasehook/useLoadSongUrl";
import { Song } from "@/types/type";
import Image from "next/image";

interface MediaItemProps {
  song: Song;
  onClick: (url: string, imageUrl: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({song, onClick}) => {

  const imageUrl = useLoadImage(song);
  const songUrl = useLoadSong(song!);


  return (
    <div onClick={() => onClick(songUrl!, imageUrl!)} className='w-full h-[50px] py-1 cursor-pointer text-white flex gap-2 justify-start select-none px-2 items-center rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800  '>
      <div className="w-[35px] h-[35px] rounded-full relative overflow-hidden">
        <Image
          src={imageUrl!}
          fill
          alt="music"
        />
      </div>
     <h1 className="text-sm text-neutral-400 select-none">
     {song.title}
     </h1> 
    </div>

  )
}

export default MediaItem