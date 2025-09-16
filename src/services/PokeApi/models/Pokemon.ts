import type { GetPokemonByIdQuery } from '../types/PokeApiTypes';

export class Pokemon {
    id!: number;
    name!: string;
    types!: (number | undefined)[];
    stats!: Record<number, number>;
    moves!: { id: number; learn: { method: string; level?: number } }[];

    constructor(params: Pokemon) {
        Object.assign(this, params);
    }

    static fromQuery(data: GetPokemonByIdQuery['results'][0]) {
        return new Pokemon({
            id: data.id,
            name: data.name,
            types: data.pokemontypes.map((t) => t.type?.id),
            stats: data.pokemonstats.reduce(
                (acc, stat) => ({ ...acc, [stat.stat?.id || '-']: stat.base_stat }),
                {} as Record<number, number>
            ),
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
