import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import type {
    Pokemon_Bool_Exp,
    Pokemon_Aggregate,
    GetPokemonCountQuery,
    GetPokemonCountQueryVariables
} from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON_COUNT = gql`
    query GetPokemonCount($where: pokemon_bool_exp) {
        pokemon_aggregate(where: $where) {
            aggregate {
                count
            }
        }
    }
`;

export const GetPokemonCount = async (params?: { where?: Pokemon_Bool_Exp }) => {
    const { where } = params || {};
    const response = await PokeApiClient.query<GetPokemonCountQuery, GetPokemonCountQueryVariables>({
        query: GET_POKEMON_COUNT,
        variables: { where },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon count: ${response.error.message}`);
    if (!response.data?.pokemon_aggregate) throw new Error('No data returned for Pokémon count');

    return response.data.pokemon_aggregate.aggregate?.count || 0;
};
