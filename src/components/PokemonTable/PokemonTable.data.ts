import type {
    FindMovesResponse,
    FindPokemonResponse,
    FindStatsResponse,
    FindTypesResponse,
    Move,
    Pokemon
} from '@services/PokeApi';

export type PokemonTableRow = Omit<Pokemon, 'moves'> & { moves: Move[] } & {};

export async function getPokemonTableColsData(props: { lang: string }) {
    const request = (path: string) => fetch(`/pokebase/data/${props.lang}${path}`).then((res) => res.json());

    const [stats, types] = await Promise.all([
        request(`/stats.json`) as FindStatsResponse,
        request(`/types.json`) as FindTypesResponse
    ]);

    return { stats, types };
}

export async function getPokemonTableRowsData(props: { lang: string }) {
    const request = (path: string) => fetch(`/pokebase/data/${props.lang}${path}`).then((res) => res.json());

    const [pokemon, moves] = await Promise.all([
        request(`/pokemon.json`) as FindPokemonResponse,
        request(`/moves.json`) as FindMovesResponse
    ]);

    const rows: PokemonTableRow[] = (pokemon as Pokemon[]).map((pokemon: Pokemon) => ({
        ...pokemon,
        moves: pokemon.moves.map((move) => moves[move.id])
    }));

    return { rows };
}
