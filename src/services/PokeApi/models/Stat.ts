export class Stat {
    id!: number;
    name!: string;

    constructor(params: Stat) {
        Object.assign(this, params);
    }

    static fromQuery(data: { id: number; name: string }): Stat {
        return new Stat({
            id: data.id,
            name: data.name
        });
    }
}
