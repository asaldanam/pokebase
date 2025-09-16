import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import { Pokemon } from '../models/Pokemon';
import type { GetPokemonByIdQuery, GetPokemonByIdQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON_BY_ID = gql`
    query GetPokemonById($id: Int, $gen: String = "generation-ix") {
        results: pokemon(where: { id: { _eq: $id } }) {
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
            pokemonmoves(where: { versiongroup: { generation: { name: { _eq: $gen } } } }) {
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

export const GetPokemonById = async (params: { id: number; lang?: string }) => {
    const { id, lang = 'en' } = params;
    const response = await PokeApiClient.query<GetPokemonByIdQuery, GetPokemonByIdQueryVariables>({
        query: GET_POKEMON_BY_ID,
        variables: { id },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon with id ${id}: ${response.error.message}`);
    if (!response.data?.results) throw new Error(`No data returned for Pokémon with id ${id}`);

    const pokemon = response.data.results.map(Pokemon.fromQuery)[0];

    return pokemon;
};
