import { PokeApiClient } from '../clients/PokeApiClient';
import { Pokemon } from '../models/Pokemon';
import { GetPokemon } from '../queries/GetPokemon';
import { GetTypes } from '../queries/GetTypes';
import type {
    GetPokemonQuery,
    GetPokemonQueryVariables,
    GetTypesQuery,
    GetTypesQueryVariables
} from '../types/PokeApiTypes';

export const findPokemon = async (params?: { lang?: string; gen?: number }) => {
    const { gen = 9, lang = 'en' } = params || {};

    const query = await Promise.all([
        await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
            query: GetPokemon,
            variables: { gen },
            errorPolicy: 'all'
        }),
        await PokeApiClient.query<GetTypesQuery, GetTypesQueryVariables>({
            query: GetTypes,
            variables: { lang },
            errorPolicy: 'all'
        })
    ]).then(([pokemon, types]) => ({ pokemon, types }));

    if (query.pokemon.error) throw new Error(`Error fetching Pokémon: ${query.pokemon.error.message}`);
    if (query.types.error) throw new Error(`Error fetching types: ${query.types.error.message}`);
    if (!query.pokemon.data) throw new Error(`No data returned for Pokémon`);
    if (!query.types.data) throw new Error(`No data returned for types`);

    const result = query.pokemon.data.results
        //
        .map((pokemon) => Pokemon.fromQuery({ pokemon, types: query.types.data!.results }));

    return result;
};

export type FindPokemonResponse = ReturnType<typeof findPokemon>;
