import type { ColDef, GridOptions } from 'ag-grid-community';
import type { PokemonTableRow } from './PokemonTable.data';
import type { FindStatsResponse, FindTypesResponse, Pokemon, Stat, Type } from '@services/PokeApi';
import { EffectivenessCategory, type PokemonTypes } from '@services/PokeApi/models/PokemonTypes';

export function createPokemonTableCols(props: {
    lang: string;
    types: Awaited<FindTypesResponse>;
    stats: Awaited<FindStatsResponse>;
}): GridOptions<PokemonTableRow>['columnDefs'] {
    const { lang, types, stats } = props;

    return [
        // Pokemon
        {
            field: 'id',
            pinned: true,
            maxWidth: 100,
            minWidth: 100,
            filter: false,
            valueFormatter: ({ value }) => `#${value.toString().padStart(4, '0')}`
        },
        {
            pinned: true,
            field: 'name',
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            maxWidth: 200,
            minWidth: 80,
            valueFormatter: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1)
        },

        // Types
        {
            field: 'types',
            openByDefault: true,
            floatingFilter: true,
            children: [
                {
                    field: 'types',
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                    maxWidth: 280,
                    minWidth: 280,
                    valueFormatter: ({ value }) => {
                        const types = value as PokemonTypes;
                        return types.ids.map((id) => types[id]?.name || 'Unknown').join(', ');
                    },
                    filterValueGetter: ({ data }) => {
                        if (!data) return '';
                        return data.types.ids.map((id: number) => types[id].name);
                    },
                    cellRenderer: ({ value }) => {
                        const types = value as PokemonTypes;
                        return types.ids
                            .map(
                                (id) =>
                                    `<img src="/static/types/${lang}/${id}.png" alt="${id}" style="width: 90px; margin-right: 0.5rem" />`
                            )
                            .join('');
                    }
                },
                {
                    field: 'types.effectiveness',
                    headerName: 'Effectiveness',
                    filter: false,
                    children: Object.values(EffectivenessCategory).map(
                        (category) =>
                            ({
                                field: `types.effectiveness.${category}`,
                                headerName: category,
                                filter: 'agMultiColumnFilter',
                                minWidth: 280,
                                maxWidth: 280,
                                //ordena por el número de tipos en esa categoría
                                comparator(a, b) {
                                    return (a?.length || 0) - (b?.length || 0);
                                },
                                cellRenderer: ({ value }) => {
                                    const typesIds = value as Array<Type['id']>;
                                    return typesIds
                                        .map(
                                            (id) =>
                                                `<img src="/static/types/icons/${id}.svg" alt="${id}" style="width: 18px; margin-right: 2px" />`
                                        )
                                        .join('');
                                }
                            } as ColDef<PokemonTableRow>)
                    )
                }
            ]
        },

        {
            field: 'stats',
            wrapHeaderText: true,
            openByDefault: true,
            children: [
                {
                    field: 'stats.total',
                    headerName: 'Total',
                    // columnGroupShow: 'closed',
                    filter: 'agNumberColumnFilter',
                    floatingFilter: true,
                    minWidth: 180,
                    maxWidth: 180
                },
                ...Array.from({ length: 6 }, (_, i) => i + 1).map(
                    (i) =>
                        ({
                            field: `stats.${i}`,
                            headerName: `${stats[i]?.name || `Stat ${i}`}`,
                            columnGroupShow: 'open',
                            filter: 'agNumberColumnFilter',
                            floatingFilter: true,
                            minWidth: 120,
                            maxWidth: 120
                        } as ColDef<PokemonTableRow>)
                )
            ]
        },

        // Moves
        {
            field: 'moves',
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            valueFormatter: ({ context, value }) => {
                const count = value.length;
                return `${count} move${count !== 1 ? 's' : ''}`;
            },
            filterValueGetter: ({ data }) => {
                return data?.moves.map((move) => move.name).join(', ');
            },
            minWidth: 280,
            maxWidth: 280
        }
    ];
}
