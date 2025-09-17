import * as PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export const prerender = true;

export async function getStaticPaths() {
    return [
        //
        // Pre-render for all supported languages
        { params: { lang: 'en' } },
        { params: { lang: 'es' } }
    ];
}

export const GET: APIRoute = async () => {
    const stats = await PokeApi.findStats();

    return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400' // Cache for 1 day
        }
    });
};
