import type { GetPokemonQuery, GetTypesQuery } from '../types/PokeApiTypes';
import type { Type } from './Type';

export class PokemonTypes {
    ids!: [Type['id']] | [Type['id'], Type['id']];
    effectiveness?: {
        '2x': Array<Type['id']>;
        '4x': Array<Type['id']>;
        '0.5x': Array<Type['id']>;
        '0.25x': Array<Type['id']>;
        immune: Array<Type['id']>;
    };

    constructor(params: PokemonTypes) {
        Object.assign(this, params);
    }

    static fromQuery(params: {
        pokemontypes: GetPokemonQuery['results']['0']['pokemontypes'];
        types: GetTypesQuery['results'];
    }) {
        const { types, pokemontypes } = params;
        const typeIds = pokemontypes.map((t) => t.type!.id) as PokemonTypes['ids'];

        const efficacies = [
            // Eficacias del primer tipo
            types[typeIds[0]].typeefficacies,
            // Eficacias del segundo tipo (si existe)
            typeIds[1] ? types[typeIds[1]].typeefficacies : null
        ];

        // Eficacia de los ataques de tipo con id 1 (normal) al primer tipo del pokémon (multiplicador, valores: 0, 50, 100, 200)
        console.log(efficacies[0]?.find((e) => e.target_type_id === 1)?.damage_factor);
        // Eficacia de los ataques de tipo con id 1 (normal) al segundo tipo del pokémon (si existe)
        console.log(efficacies[1]?.find((e) => e.target_type_id === 1)?.damage_factor);

        //TODO:
        /**
         * Calcular la "effectiveness" combinadas para los tipos de los pokemon, teniendo en cuenta que:
         * - Un pokemon puede tener 1 o 2 tipos
         * - Los factores de daño pueden ser: '2x' (200), '4x' (400), '0.5x' (50), '0.25x' (25), 'immune' (0)
         * - La eficacia combinada se calcula multiplicando los factores de daño de ambos tipos
         * - Si un tipo no tiene eficacia contra otro, se considera que el factor de daño es 100 (1x)
         *
         * Ejemplo 1:
         *   Garchomp (tipo 1: dragon, tipo 2: ground)
         *   - Eficacia de ataques de tipo ice contra el tipo 1 (dragon): 200 (2x)
         *   - Eficacia de ataques de tipo ice contra el tipo 2 (ground): 200 (2x)
         *   - Eficacia combinada: 0.5 * 2 = 1x (100)
         *
         * Ejemplo 2:
         *   Dialga (tipo 1: steel, tipo 2: dragon)
         *   - Eficacia de ataques de tipo grass contra el tipo 1 (steel): 50 (0.5x)
         *   - Eficacia de ataques de tipo grass contra el tipo 2 (dragon): 50 (0.5x)
         *   - Eficacia combinada: 0.5 * 0.5 = 0.25x (25)
         *
         * Ejemplo 3:
         *   Zoroark de Hisui (tipo 1: normal, tipo 2: ghost)
         *  - Eficacia de ataques de tipo fighting contra el tipo 1 (normal): 200 (2x)
         *  - Eficacia de ataques de tipo fighting contra el tipo 2 (ghost): 0 (immune)
         *  - Eficacia combinada: 2 * 0 = immune (0)
         */
        const effectiveness: PokemonTypes['effectiveness'] = {
            '2x': [
                // TODO: llenar con los ids de los tipos que son 2x efectivos contra el pokémon
            ],
            '4x': [
                // TODO: llenar con los ids de los tipos que son 4x efectivos contra el pokémon
            ],
            '0.5x': [
                // TODO: llenar con los ids de los tipos que son 0.5x efectivos contra el pokémon
            ],
            '0.25x': [
                // TODO: llenar con los ids de los tipos que son 0.25x efectivos contra el pokémon
            ],
            immune: [
                // TODO: llenar con los ids de los tipos que son immune contra el pokémon
            ]
        };

        return new PokemonTypes({
            ids: typeIds
        });
    }
}
