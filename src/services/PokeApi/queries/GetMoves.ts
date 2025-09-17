import { gql } from '@apollo/client';

export const GetMoves = gql`
    query GetMoves($lang: String = "en", $gen: Int) {
        results: move {
            id
            name
            movenames(where: { language: { name: { _in: ["en", $lang] } } }) {
                name
                language {
                    name
                }
            }
            moveflavortexts(where: { language: { name: { _eq: $lang } } }) {
                flavor_text
            }
            power
            pp
            accuracy
            movedamageclass {
                id
                name
            }
            type {
                id
                name
            }
            movemeta {
                crit_rate
                drain
                flinch_chance
                healing
                max_hits
                max_turns
                min_hits
                min_turns
            }
            machines(where: { versiongroup: { generation: { id: { _eq: $gen } } } }) {
                machine_number
            }
        }
    }
`;
