import type {
    FindMovesResponse,
    FindPokemonResponse,
    FindStatsResponse,
    FindTypesResponse,
    Move,
    Pokemon
} from '@services/PokeApi';

export type PokemonTableRow = Omit<Pokemon, 'moves'> & { moves: Move[] } & {};

export async function getPokemonTableData(props: { lang: string }) {
    const request = (path: string) => fetch(`/data/${props.lang}${path}`).then((res) => res.json());

    const [pokemon, moves, stats, types] = await Promise.all([
        request(`/pokemon.json`) as FindPokemonResponse,
        request(`/moves.json`) as FindMovesResponse,
        request(`/stats.json`) as FindStatsResponse,
        request(`/types.json`) as FindTypesResponse
    ]);

    const rows: PokemonTableRow[] = (pokemon as Pokemon[]).map((pokemon: Pokemon) => ({
        ...pokemon,
        moves: pokemon.moves.map((move) => moves[move.id])
    }));

    return { rows, stats, types };
}
