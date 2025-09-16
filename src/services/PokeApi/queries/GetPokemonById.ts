import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import type { GetPokemonByIdQuery, GetPokemonByIdQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_POKEMON_BY_ID = gql`
    query GetPokemonById($id: Int, $lang: String = "en", $gen: String = "generation-ix") {
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
                    machines(where: { versiongroup: { generation: { name: { _eq: $gen } } } }) {
                        machine_number
                    }
                }
            }
        }
    }
`;

export const GetPokemonById = async (params: { id: number; lang?: string }) => {
    const { id, lang = 'en' } = params;
    const response = await PokeApiClient.query<GetPokemonByIdQuery, GetPokemonByIdQueryVariables>({
        query: GET_POKEMON_BY_ID,
        variables: { id, lang },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching Pokémon with id ${id}: ${response.error.message}`);
    if (!response.data?.results) throw new Error(`No data returned for Pokémon with id ${id}`);

    const pokemon = response.data.results.map((data) => ({
        id: data.id,
        name: data.name,
        types: data.pokemontypes.map((t) => t.type?.id),
        stats: data.pokemonstats.reduce(
            (acc, stat) => ({ ...acc, [stat.stat?.id || '-']: stat.base_stat }),
            {} as Record<number, number>
        ),
        moves: data.pokemonmoves.map((pm) => {
            const move = pm.move;
            if (!move) return null;

            const learnmethod = pm.movelearnmethod?.name;
            const meta = Object
                //
                .entries(move.movemeta[0] || [])
                .filter(([key, value]) => Boolean(value) && key !== '__typename')
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {} as Record<string, any>);

            return {
                id: move.id,
                name:
                    move.movenames
                        //
                        .find((n) => n.language?.name === lang)?.name || move.name,
                desc:
                    move.moveflavortexts
                        //
                        .slice(-1)[0]
                        ?.flavor_text.replaceAll('\n', ' ') || null,
                power: move.power,
                pp: move.pp,
                accuracy: move.accuracy,
                class: move.movedamageclass?.id || null,
                type: move.type?.id || null,
                meta: Object.values(meta).length > 0 ? meta : undefined,
                learn:
                    //prettier-ignore
                    (learnmethod === 'level-up' && { method: 'level-up', level: pm.level || 0 }) ||
                    (learnmethod === 'machine' && { method: 'machine', number: move.machines[0].machine_number }) ||
                    { method: learnmethod }
            };
        })
    }));

    return pokemon;
};
