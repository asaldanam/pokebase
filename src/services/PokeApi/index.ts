import { findMoves } from './methods/findMoves';
import { findPokemon } from './methods/findPokemon';
import { countPokemon } from './methods/countPokemon';
import { findTypes } from './methods/findTypes';

export * from './models/Pokemon';
export * from './models/Move';
export * from './models/Stat';
export * from './models/Type';

export default {
    findPokemon,
    countPokemon,
    findMoves,
    findTypes
};
