import PokeApi from '@services/PokeApi';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    try {
        const result = await PokeApi.GetPokemon();

        return new Response(JSON.stringify(result.data?.pokemon), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);

        return new Response(
            JSON.stringify({
                error: 'Failed to fetch Pokemon data',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};
