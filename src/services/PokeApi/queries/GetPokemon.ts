import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import type { GetPokemonQuery, GetPokemonQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON = gql`
    query GetPokemon($id: Int, $lang: String = "en") {
        pokemon: pokemon(where: { id: { _eq: $id } }) {
            id
            name
            pokemonsprites {
                sprites(path: "front_default")
            }
            pokemonstats {
                base_stat
                stat {
                    name
                }
            }
            pokemontypes {
                type {
                    name
                }
            }
            pokemonmoves {
                move {
                    id
                    name
                    movenames(where: { language: { name: { _in: ["en", $lang] } } }) {
                        name
                        language {
                            name
                        }
                    }
                    moveeffect {
                        moveeffecteffecttexts(where: { language: { name: { _in: ["en", $lang] } } }) {
                            effect
                            short_effect
                            language {
                                name
                            }
                        }
                    }
                    power
                    pp
                    accuracy
                    movedamageclass {
                        name
                    }
                    type {
                        name
                    }
                }
            }
        }
    }
`;

export const GetPokemon = async (params: { id: number; lang: string }) => {
    const { id, lang = 'en' } = params;
    const result = await PokeApiClient.query<GetPokemonQuery, GetPokemonQueryVariables>({
        query: GET_POKEMON,
        variables: { id, lang },
        errorPolicy: 'all'
    });

    return result;
};
