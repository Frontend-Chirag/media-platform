import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {

        const supabase = createServerComponentClient({
            cookies: cookies
        });

        const title = req.nextUrl.searchParams.get('searchQuery') as string;

        if (!title) {

            const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    
            if (error) {
                console.log('Failed to get all songs', error)
            }

            return NextResponse.json(data as any || []);
        }

        const { data, error } = await supabase.from('songs').select('*').ilike('title', `%${title}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Failed to get searched songs', error)
        }

        return NextResponse.json(data as any || []);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to search song by Title' }, { status: 404 });
    }
}