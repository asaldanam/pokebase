import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import type { GetPokemonQuery, GetPokemonQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON = gql`
    query GetPokemon($limit: Int = 1) {
        pokemon: pokemon(limit: $limit) {
            id
            name
            height
            weight
            base_experience
            pokemonmoves(limit: 1) {
                move {
                    id
                    name
                    power
                    pp
                    accuracy
                }
            }
        }
    }
`;

export const GetPokemon = async (limit: number = 1) => {
    const result = await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
        query: GET_POKEMON,
        variables: { limit },
        errorPolicy: 'all'
    });

    // Ahora tienes tipado completo!
    const firstPokemon = result.data?.pokemon?.[0];
    const firstMove = firstPokemon?.pokemonmoves?.[0]?.move;

    console.log(firstMove);

    return result;
};
