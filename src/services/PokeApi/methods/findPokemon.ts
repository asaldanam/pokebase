import { PokeApiClient } from '../clients/PokeApiClient';
import { Pokemon } from '../models/Pokemon';
import { GetPokemon } from '../queries/GetPokemon';
import type { GetPokemonQuery, GetPokemonQueryVariables } from '../types/PokeApiTypes';

export const findPokemon = async (params?: { lang?: string; gen?: number }) => {
    const { gen = 9, lang = 'en' } = params || {};

    const query = await Promise.all([
        await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
            query: GetPokemon,
            variables: { gen },
            errorPolicy: 'all'
        })
    ]).then((responses) => ({
        pokemon: responses[0]
    }));

    if (query.pokemon.error) throw new Error(`Error fetching Pokémon: ${query.pokemon.error.message}`);
    if (!query.pokemon.data?.results.length) throw new Error(`No data returned for Pokémon`);

    const result = query.pokemon.data.results.map((pokemon) => Pokemon.fromQuery({ pokemon, types: [] }));
    return result;
};

export type FindPokemonResponse = ReturnType<typeof findPokemon>;
