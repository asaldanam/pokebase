import { PokeApiClient } from '../clients/PokeApiClient';
import { Move } from '../models/Move';
import { GetMoves } from '../queries/GetMoves';
import type { GetMovesQuery, GetMovesQueryVariables } from '../types/PokeApiTypes';

export const findMoves = async (params: { lang?: string; gen?: number }) => {
    const { lang = 'en', gen = 9 } = params;
    const response = await PokeApiClient.query<GetMovesQuery, GetMovesQueryVariables>({
        query: GetMoves,
        variables: { lang, gen },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching moves: ${response.error.message}`);
    if (!response.data?.results) throw new Error(`No data returned for moves`);

    const moves = response.data.results
        .map((data) => Move.fromQuery(data))
        .reduce((moves, move) => ({ ...moves, [move.id]: move }), {} as Record<number, Move>);

    return moves;
};

export type FindMovesResponse = ReturnType<typeof findMoves>;
