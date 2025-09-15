import type { APIRoute } from 'astro';
import { PokeApi } from '../../../services/PokeApi';

export const GET: APIRoute = async () => {
    try {
        const result = await PokeApi.pokemon();

        return new Response(JSON.stringify(result.data), {
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
