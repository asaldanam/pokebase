import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import { Move } from '../models/Move';
import type { GetMovesQuery, GetMovesQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_MOVES = gql`
    query GetMoves($lang: String = "en", $gen: String = "generation-ix") {
        results: move {
            id
            name
            movenames(where: { language: { name: { _in: ["en", $lang] } } }) {
                name
                language {
                    name
                }
            }
            moveflavortexts(where: { language: { name: { _eq: $lang } } }) {
                flavor_text
            }
            power
            pp
            accuracy
            movedamageclass {
                id
                name
            }
            type {
                id
                name
            }
            movemeta {
                crit_rate
                drain
                flinch_chance
                healing
                max_hits
                max_turns
                min_hits
                min_turns
            }
            machines(where: { versiongroup: { generation: { name: { _eq: $gen } } } }) {
                machine_number
            }
        }
    }
`;

export const GetMoves = async (params: { lang?: string }) => {
    const { lang = 'en' } = params;
    const response = await PokeApiClient.query<GetMovesQuery, GetMovesQueryVariables>({
        query: GET_MOVES,
        variables: { lang },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching moves: ${response.error.message}`);
    if (!response.data?.results) throw new Error(`No data returned for moves`);

    const moves = response.data.results
        .map((data) => Move.fromQuery(data))
        .reduce((moves, move) => ({ ...moves, [move.id]: move }), {} as Record<number, Move>);

    return moves;
};
