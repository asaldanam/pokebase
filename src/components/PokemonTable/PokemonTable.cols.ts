import type { ColDef, GridOptions } from 'ag-grid-community';
import type { PokemonTableRow } from './PokemonTable.data';
import type { FindStatsResponse, FindTypesResponse, Pokemon, Stat, Type } from '@services/PokeApi';

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
                        if (!Array.isArray(value)) return value;
                        return value.map((typeId: number) => types[typeId]?.name || 'Unknown').join(', ');
                    },
                    filterValueGetter: ({ data }) => {
                        if (!data?.types || !Array.isArray(data.types)) return [];
                        return data.types.map((typeId: number) => types[typeId]?.name || 'Unknown');
                    },
                    cellRenderer: ({ value }) => {
                        return value
                            .map(
                                (type) =>
                                    `<img src="/static/types/${lang}/${type}.png" alt="${type}" style="width: 90px; margin-right: 0.5rem" />`
                            )
                            .join('');
                    }
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
