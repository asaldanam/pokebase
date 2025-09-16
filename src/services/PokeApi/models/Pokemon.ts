import type { GetPokemonQuery } from '../types/PokeApiTypes';
import { Stat } from './Stat';

export class Pokemon {
    id!: number;
    name!: string;
    types!: (number | undefined)[];
    stats!: Record<string, number>;
    moves!: { id: number; learn: { method: string; level?: number } }[];

    constructor(params: Pokemon) {
        Object.assign(this, params);
    }

    static fromQuery(data: GetPokemonQuery['results'][0]) {
        const stats = data.pokemonstats.reduce(
            (acc, stat) => ({ ...acc, [stat.stat?.id.toString() || '-']: stat.base_stat }),
            {} as Record<string, number>
        );

        return new Pokemon({
            id: data.id,
            name: data.name,
            types: data.pokemontypes.map((t) => t.type?.id),
            stats: {
                total: Object.values(stats).reduce((a, b) => a + b, 0), // total
                ...stats
            },
            moves: data.pokemonmoves.map((pm) => {
                const move = pm.move!;
                const learnmethod = pm.movelearnmethod?.name!;

                return {
                    id: move.id,
                    learn:
                        //prettier-ignore
                        (learnmethod === 'level-up' && { method: 'level-up', level: pm.level || 0 }) ||
                        { method: learnmethod }
                };
            })
        });
    }
}
