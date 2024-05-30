import { NextResponse, NextRequest } from 'next/server';
import { Song } from '@/types/type';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const GET = async () => {
    try {
        const supabase = createServerComponentClient({
            cookies: cookies
        });
    
        const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    
        if (error) {
            console.log(error)
        }

        return NextResponse.json(data as any || []);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to fetch all songs' }, { status: 404 })
    }
}