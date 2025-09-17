import type { GetPokemonQuery, GetTypesQuery } from '../types/PokeApiTypes';
import type { Type } from './Type';

/**
 * Representa la información relativa a los tipos de un Pokemon,
 * incluyendo sus ids y su efectividad combinada contra otros tipos.
 */
export class PokemonTypes {
    ids!: [Type['id']] | [Type['id'], Type['id']];
    effectiveness!: {
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

        // Calcular la efectividad combinada para todos los tipos de ataque
        const effectiveness: PokemonTypes['effectiveness'] = {
            '2x': [],
            '4x': [],
            '0.5x': [],
            '0.25x': [],
            immune: []
        };

        // Obtener todos los tipos únicos disponibles
        const allTypeIds = Object.keys(types).map((id) => parseInt(id));

        // Para cada tipo de ataque, calcular la efectividad combinada
        for (const attackingTypeId of allTypeIds) {
            // Obtener el factor de daño contra el primer tipo
            const damage1 = efficacies[0]?.find((e) => e.target_type_id === attackingTypeId)?.damage_factor ?? 100;

            // Obtener el factor de daño contra el segundo tipo (si existe)
            const damage2 = typeIds[1]
                ? efficacies[1]?.find((e) => e.target_type_id === attackingTypeId)?.damage_factor ?? 100
                : 100;

            // Calcular la efectividad combinada multiplicando los factores
            // Convertir de escala 0-200 a multiplicador decimal (0, 0.5, 1, 2)
            const factor1 = damage1 / 100;
            const factor2 = damage2 / 100;
            const combinedFactor = factor1 * factor2;

            // Convertir de vuelta a la escala original para clasificar
            const multiplier = Math.round(combinedFactor * 100);

            // Clasificar según la efectividad combinada
            if (multiplier === 0) effectiveness.immune.push(attackingTypeId);
            if (multiplier === 25) effectiveness['0.25x'].push(attackingTypeId);
            if (multiplier === 50) effectiveness['0.5x'].push(attackingTypeId);
            if (multiplier === 200) effectiveness['2x'].push(attackingTypeId);
            if (multiplier === 400) effectiveness['4x'].push(attackingTypeId);
            // Los tipos con efectividad 1x (100) no se incluyen en ningún array
        }

        return new PokemonTypes({
            ids: typeIds,
            effectiveness
        });
    }
}
