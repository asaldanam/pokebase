import { PokeApiClient } from '../clients/PokeApiClient';
import { GetPokemonCount } from '../queries/GetPokemonCount';
import type { GetPokemonCountQuery, GetPokemonCountQueryVariables, Pokemon_Bool_Exp } from '../types/PokeApiTypes';

export const countPokemon = async (params?: { where?: Pokemon_Bool_Exp }) => {
    const { where } = params || {};
    const response = await PokeApiClient.query<GetPokemonCountQuery, GetPokemonCountQueryVariables>({
        query: GetPokemonCount,
        variables: { where },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon count: ${response.error.message}`);
    if (!response.data?.pokemon_aggregate) throw new Error('No data returned for Pokémon count');

    return response.data.pokemon_aggregate.aggregate?.count || 0;
};
