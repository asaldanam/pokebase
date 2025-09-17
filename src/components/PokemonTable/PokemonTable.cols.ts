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
            openByDefault: false,
            floatingFilter: true,
            children: [
                {
                    field: 'types',
                    filter: 'agTextColumnFilter',
                    floatingFilter: true,
                    minWidth: 160,
                    maxWidth: 160,
                    valueFormatter: ({ value }) => {
                        const types = value as PokemonTypes;
                        return types.ids.map((id) => types[id]?.name || 'Unknown').join(', ');
                    },
                    filterValueGetter: ({ data }) => {
                        if (!data) return '';
                        return data.types.ids.map((id: number) => types[id].name);
                    },
                    cellRenderer: ({ value }) => {
                        const typesIds = (value as PokemonTypes).ids;
                        const icons = typesIds
                            .map(
                                (id) => /*html*/ `
                                    <img src="/static/types/${lang}/${id}.png" alt="${id}" style="height: 18px;"/>
                                `
                            )
                            .join('');
                        return /*html*/ `
                                        <div
                                            style="
                                                display: flex;
                                                flex-direction: column;
                                                gap: 4px;
                                                align-items: center;
                                                justify-content: center;
                                                align-content: center;
                                                max-width: 7rem;
                                                height: 100%;
                                            "
                                        >
                                            ${icons}
                                        </div>
                                    `;
                    }
                },
                {
                    field: 'types.effectiveness',
                    columnGroupShow: 'open',
                    headerName: 'Weaknesses',
                    openByDefault: true,
                    children: [
                        createEffectivenessColumn({ category: EffectivenessCategory.DOUBLE, types }),
                        createEffectivenessColumn({ category: EffectivenessCategory.QUADRUPLE, types })
                    ]
                },
                {
                    field: 'types.effectiveness',
                    columnGroupShow: 'open',
                    headerName: 'Resistances',
                    openByDefault: true,
                    children: [
                        createEffectivenessColumn({ category: EffectivenessCategory.HALF, types }),
                        createEffectivenessColumn({ category: EffectivenessCategory.QUARTER, types }),
                        createEffectivenessColumn({ category: EffectivenessCategory.IMMUNE, types })
                    ]
                }
            ]
        },

        // Stats
        {
            field: 'stats',
            wrapHeaderText: true,
            openByDefault: false,
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
                return `${count} move${count !== 1 ? 's' : ''} total`;
            },
            filterValueGetter: ({ data }) => {
                return data?.moves.map((move) => move.name).join(', ');
            },
            minWidth: 280,
            maxWidth: 280
        }
    ];
}

const createEffectivenessColumn = (props: {
    category: EffectivenessCategory;
    types: Awaited<FindTypesResponse>;
}): ColDef<PokemonTableRow> => {
    const { category, types } = props;
    return {
        field: `types.effectiveness.${category}`,
        headerName: category.charAt(0).toUpperCase() + category.slice(1),
        filter: 'agMultiColumnFilter',
        columnGroupShow: 'open',
        floatingFilter: true,
        minWidth: 150,
        maxWidth: 150,
        //ordena por el número de tipos en esa categoría
        comparator(a, b) {
            return (a?.length || 0) - (b?.length || 0);
        },
        filterValueGetter: ({ data }) => {
            if (!data) return '';
            return (data.types.effectiveness[category] || []).map((id: number) => types[id].name).join(', ');
        },
        cellRenderer: ({ value }) => {
            const typesIds = value as Array<Type['id']>;
            const icons = typesIds
                .map(
                    (id) => /*html*/ `
                        <img src="/static/types/icons/${id}.svg" alt="${id}" style="height: 18px;"/>
                    `
                )
                .join('');
            return /*html*/ `
                <div
                    style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        max-width: 7rem;
                        height: 100%;
                        align-content: center;
                    "
                >
                    ${icons}
                </div>
            `;
        }
    };
};
