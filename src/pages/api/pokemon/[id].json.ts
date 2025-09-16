import PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export function getStaticPaths() {
    return Array.from({ length: 151 }, (_, i) => ({
        params: { id: (i + 1).toString() }
    }));
}

export const GET: APIRoute = async ({ params, request }) => {
    if (!params.id || isNaN(Number(params.id))) {
        return new Response(JSON.stringify({ error: 'Invalid or missing id parameter' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const id = parseInt(params.id);
    const { data, error } = await PokeApi.GetPokemon({ id, lang: 'es' });

    if (error) {
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

    if (!data?.pokemon) {
        return new Response(JSON.stringify({ error: 'No Pokemon data found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify(data?.pokemon), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
