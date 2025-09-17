import { gql } from '@apollo/client';

export const GetPokemonCount = gql`
    query GetPokemonCount($where: pokemon_bool_exp) {
        pokemon_aggregate(where: $where) {
            aggregate {
                count
            }
        }
    }
`;
