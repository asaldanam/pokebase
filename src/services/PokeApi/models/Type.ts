import type { GetTypesQuery } from '../types/PokeApiTypes';

export class Type {
    id!: number;
    name!: string;
    efficacies!: Array<{
        target: number | null;
        factor: number;
    }>;

    constructor(params: Type) {
        Object.assign(this, params);
    }

    static fromQuery(data: GetTypesQuery['results'][0]) {
        return new Type({
            id: data.id,
            name:
                data.typenames.filter((tn) => tn.language?.name !== 'en')[0]?.name ||
                data.typenames.find((tn) => tn.language?.name === 'en')?.name ||
                `Type ${data.id}`,
            efficacies: data.typeefficacies.map((efficacy) => ({
                target: efficacy.target_type_id ?? null,
                factor: efficacy.damage_factor
            }))
        });
    }
}
