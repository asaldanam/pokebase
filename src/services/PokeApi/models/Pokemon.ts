import type { GetPokemonQuery } from '../types/PokeApiTypes';
import { PokemonTypes } from './PokemonTypes';
import type { Stat } from './Stat';

export class Pokemon {
    id!: number;
    name!: string;
    types!: PokemonTypes;
    stats!: Record<Stat['id'], number>;
    moves!: { id: number; learn: { method: string; level?: number } }[];

    constructor(params: Pokemon) {
        Object.assign(this, params);
    }

    static fromQuery(params: { pokemon: GetPokemonQuery['results'][0]; types: GetPokemonQuery['results'] }) {
        const { pokemon } = params;

        const stats = pokemon.pokemonstats.reduce(
            (acc, stat) => ({ ...acc, [stat.stat?.id.toString() || '-']: stat.base_stat }),
            {} as Record<string, number>
        );

        return new Pokemon({
            id: pokemon.id,
            name: pokemon.name,
            types: new PokemonTypes({
                ids: pokemon.pokemontypes.map((t) => t.type!.id) as PokemonTypes['ids']
            }),
            stats: {
                total: Object.values(stats).reduce((a, b) => a + b, 0), // total
                ...stats
            },
            moves: pokemon.pokemonmoves.map((pm) => {
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
