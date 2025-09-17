import { gql } from '@apollo/client';

export const GetTypes = gql`
    query GetTypes($lang: String = "es") {
        results: type {
            id
            typenames(where: { language: { name: { _in: [$lang, "en"] } } }) {
                name
                language {
                    name
                }
            }
            typeefficacies {
                target_type_id
                damage_factor
            }
        }
    }
`;
