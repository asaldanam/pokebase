import PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
    const count = 1025;

    return Array.from({ length: count }, (_, i) => ({
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

    try {
        const pokemon = await PokeApi.GetPokemonById({ id, lang: 'es' });

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
