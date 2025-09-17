import { PokeApiClient } from '../clients/PokeApiClient';
import { Pokemon } from '../models/Pokemon';
import { GetPokemon } from '../queries/GetPokemon';
import type { GetPokemonQuery, GetPokemonQueryVariables } from '../types/PokeApiTypes';

export const findPokemon = async (params?: { lang?: string; gen?: number }) => {
    const { gen = 9, lang = 'en' } = params || {};

    const response = await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
        query: GetPokemon,
        variables: { gen },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon: ${response.error.message}`);
    if (!response.data?.results.length) throw new Error(`No data returned for Pokémon`);

    const pokemon = response.data.results.map(Pokemon.fromQuery);

    return pokemon;
};
