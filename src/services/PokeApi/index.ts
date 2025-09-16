import { GetMoves } from './queries/GetMoves';
import { GetPokemon } from './queries/GetPokemon';
import { GetPokemonCount } from './queries/GetPokemonCount';

export * from './models/Pokemon';
export * from './models/Move';
export * from './models/Stat';

export default {
    GetPokemon,
    GetPokemonCount,
    GetMoves
};
