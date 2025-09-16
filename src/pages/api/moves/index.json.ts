import PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    try {
        const pokemon = await PokeApi.GetMoves({ lang: 'en' });

        return new Response(JSON.stringify(pokemon), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch Pokemon data', message: error.message, stack: error.stack }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
