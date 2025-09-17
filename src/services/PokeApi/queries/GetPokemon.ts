import { gql } from '@apollo/client';

export const GetPokemon = gql`
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
