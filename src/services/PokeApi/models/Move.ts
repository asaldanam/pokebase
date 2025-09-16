import type { GetMovesQuery } from '../types/PokeApiTypes';

export class Move {
    id!: number;
    name!: string;
    desc!: string | null;
    power!: number | null;
    pp!: number | null;
    accuracy!: number | null;
    class!: number | null;
    type!: number | null;
    meta!: Record<string, any> | undefined;

    constructor(params: Move) {
        Object.assign(this, params);
    }

    static fromQuery(data: GetMovesQuery['results'][0]) {
        const meta = Object.entries(data.movemeta[0] || [])
            .filter(([key, value]) => Boolean(value) && key !== '__typename')
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {} as Record<string, any>);

        return new Move({
            id: data.id,
            name: data.movenames.filter((mvn) => mvn.language?.name !== 'en')[0]?.name || data.name,
            desc: data.moveflavortexts.slice(-1)[0]?.flavor_text.replaceAll('\n', ' ') || null,
            power: data.power ?? null,
            pp: data.pp ?? null,
            accuracy: data.accuracy ?? null,
            class: data.movedamageclass?.id || null,
            type: data.type?.id || null,
            meta: Object.values(meta).length > 0 ? meta : undefined
        });
    }
}
