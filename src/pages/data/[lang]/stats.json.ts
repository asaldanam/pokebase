import { Stat } from '@services/PokeApi';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
    return [
        //
        // Pre-render for all supported languages
        { params: { lang: 'en' } },
        { params: { lang: 'es' } }
    ];
}

export const GET: APIRoute = async () => {
    const data = [
        {
            id: 1,
            name: 'HP'
        },
        {
            id: 2,
            name: 'Atk'
        },
        {
            id: 3,
            name: 'Def'
        },
        {
            id: 4,
            name: 'Sp. Atk'
        },
        {
            id: 5,
            name: 'Sp. Def'
        },
        {
            id: 6,
            name: 'Spd'
        },
        {
            id: 7,
            name: 'Acc.'
        },
        {
            id: 8,
            name: 'Eva.'
        }
    ];

    const stats: Record<string, Stat> = Object.fromEntries(data.map((stat) => [stat.id, stat]));

    return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400' // Cache for 1 day
        }
    });
};
