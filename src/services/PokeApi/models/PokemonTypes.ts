import type { GetPokemonQuery } from '../types/PokeApiTypes';
import type { Type } from './Type';

export class PokemonTypes {
    ids!: [Type['id']] | [Type['id'], Type['id']];

    constructor(params: PokemonTypes) {
        Object.assign(this, params);
    }

    static fromQuery(params: {
        pokemontypes: GetPokemonQuery['results']['0']['pokemontypes'];
        types: GetPokemonQuery['results'];
    }) {}
}
