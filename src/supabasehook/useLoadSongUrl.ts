import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Song } from '@/types/type';

export const useLoadSong = (song: Song) => {
    const supabaseClient = useSupabaseClient();
    const [songUrl, setSongUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongUrl = async () => {
            if (song && supabaseClient) {
                const { data: songData } = await supabaseClient.storage
                    .from('songs')
                    .getPublicUrl(song.song_path);
                setSongUrl(songData?.publicUrl || null);
            }
        };

        fetchSongUrl();
    }, [song, supabaseClient]);

    return songUrl;
};