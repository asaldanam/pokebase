import { GetMoves } from './queries/GetMoves';
import { GetPokemon } from './queries/GetPokemon';
import { GetPokemonCount } from './queries/GetPokemonCount';
import { GetTypes } from './queries/GetTypes';

export * from './models/Pokemon';
export * from './models/Move';
export * from './models/Stat';
export * from './models/Type';

export default {
    GetPokemon,
    GetPokemonCount,
    GetMoves,
    GetTypes
};
