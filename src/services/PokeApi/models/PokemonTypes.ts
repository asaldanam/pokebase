import type { GetPokemonQuery, GetTypesQuery } from '../types/PokeApiTypes';
import type { Type } from './Type';

export enum EffectivenessCategory {
    QUADRUPLE = '4x',
    DOUBLE = '2x',
    HALF = '½x',
    QUARTER = '¼x',
    IMMUNE = 'immune'
}

export class PokemonTypes {
    ids!: [Type['id']] | [Type['id'], Type['id']];
    effectiveness!: {
        [EffectivenessCategory.QUADRUPLE]: Array<Type['id']>;
        [EffectivenessCategory.DOUBLE]: Array<Type['id']>;
        [EffectivenessCategory.HALF]: Array<Type['id']>;
        [EffectivenessCategory.QUARTER]: Array<Type['id']>;
        [EffectivenessCategory.IMMUNE]: Array<Type['id']>;
    };

    constructor(params: PokemonTypes) {
        Object.assign(this, params);
    }

    static fromQuery(params: {
        pokemontypes: GetPokemonQuery['results']['0']['pokemontypes'];
        types: GetTypesQuery['results'];
    }) {
        const { types, pokemontypes } = params;
        types.sort((a, b) => a.typenames[0].name.localeCompare(b.typenames[0].name));
        const pokemonTypeIds = pokemontypes.map((t) => t.type!.id) as PokemonTypes['ids'];

        // Encontrar los tipos correctos por ID
        const type1 = types.find((t) => t.id === pokemonTypeIds[0]);
        const type2 = pokemonTypeIds[1] ? types.find((t) => t.id === pokemonTypeIds[1]) : null;

        // Calcular la efectividad combinada para todos los tipos de ataque
        const effectiveness: PokemonTypes['effectiveness'] = {
            [EffectivenessCategory.DOUBLE]: [],
            [EffectivenessCategory.QUADRUPLE]: [],
            [EffectivenessCategory.HALF]: [],
            [EffectivenessCategory.QUARTER]: [],
            [EffectivenessCategory.IMMUNE]: []
        };

        // Para cada tipo de ataque, calcular la efectividad combinada
        for (const targetType of types) {
            // Obtenemos las eficacias del tipo objetivo
            const targetEfficacies = targetType.typeefficacies;

            // Se obtienen los factores de daño para cada uno de los tipos del Pokémon
            const factors = [
                targetEfficacies.find((e) => e.target_type_id === type1?.id)?.damage_factor,
                targetEfficacies.find((e) => e.target_type_id === type2?.id)?.damage_factor
            ];

            // Se obtienen los multiplicadores individuales (por defecto 1x si no hay factor)
            const firstTypeMultiplier = (factors[0] ?? 100) / 100;
            const secondTypeMultiplier = (factors[1] ?? 100) / 100;

            // Multiplicador combinado
            const combinedMultiplier = firstTypeMultiplier * secondTypeMultiplier;

            // Categorías a asignar según el multiplicador combinado
            const categories = {
                0: EffectivenessCategory.IMMUNE,
                0.25: EffectivenessCategory.QUARTER,
                0.5: EffectivenessCategory.HALF,
                2: EffectivenessCategory.DOUBLE,
                4: EffectivenessCategory.QUADRUPLE
            };

            // Obtenemos la categoría correspondiente
            const category = categories[combinedMultiplier as keyof typeof categories];

            // Si hay una categoría válida, se añade el tipo objetivo a la lista correspondiente
            effectiveness[category]?.push(targetType.id);
        }

        return new PokemonTypes({
            ids: pokemonTypeIds,
            effectiveness
        });
    }
}
