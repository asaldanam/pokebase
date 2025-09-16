import PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
    return [
        //
        // Pre-render for all supported languages
        { params: { lang: 'en' } },
        { params: { lang: 'es' } }
    ];
}

export const GET: APIRoute = async ({ params }) => {
    try {
        const { lang } = params;
        const types = await PokeApi.GetTypes({ lang });

        return new Response(JSON.stringify(types), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch Types data', message: error.message, stack: error.stack }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
