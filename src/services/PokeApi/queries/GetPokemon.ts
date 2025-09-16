import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import { Pokemon } from '../models/Pokemon';
import type { GetPokemonQuery, GetPokemonQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON_BY_ID = gql`
    query GetPokemon($gen: Int = 9) {
        results: pokemon(where: { pokemonmoves: { versiongroup: { generation: { id: { _eq: $gen } } } } }) {
            id
            name
            pokemonstats {
                base_stat
                stat {
                    id
                    name
                }
            }
            pokemontypes {
                type {
                    id
                    name
                }
            }
            pokemonmoves(where: { versiongroup: { generation: { id: { _eq: $gen } } } }) {
                movelearnmethod {
                    name
                }
                level
                move {
                    id
                }
            }
        }
    }
`;

export const GetPokemon = async (params?: { lang?: string; gen?: number }) => {
    const { gen = 9, lang = 'en' } = params || {};

    const response = await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
        query: GET_POKEMON_BY_ID,
        variables: { gen },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon: ${response.error.message}`);
    if (!response.data?.results.length) throw new Error(`No data returned for Pokémon`);

    const pokemon = response.data.results.map(Pokemon.fromQuery);

    return pokemon;
};
