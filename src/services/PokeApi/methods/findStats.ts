import type { Stat } from '../models/Stat';

export const findStats = async () => {
    const data = [
        {
            id: 1,
            name: 'HP'
        },
        {
            id: 2,
            name: 'Atk'
        },
        {
            id: 3,
            name: 'Def'
        },
        {
            id: 4,
            name: 'Sp. Atk'
        },
        {
            id: 5,
            name: 'Sp. Def'
        },
        {
            id: 6,
            name: 'Spd'
        },
        {
            id: 7,
            name: 'Acc.'
        },
        {
            id: 8,
            name: 'Eva.'
        }
    ];

    const stats: Record<string, Stat> = Object.fromEntries(data.map((stat) => [stat.id, stat]));

    return stats;
};

export type FindStatsResponse = ReturnType<typeof findStats>;
