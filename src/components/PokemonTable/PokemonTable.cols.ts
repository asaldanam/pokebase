import type { ColDef, GridOptions, IHeaderComp, IHeaderParams } from 'ag-grid-community';
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
            filter: false,
            pinned: true,
            sortable: false,
            headerName: '',
            floatingFilter: false,
            headerComponent: LogoHeaderComponent,
            minWidth: 72,
            maxWidth: 72,
            cellRenderer: ({ data }) => {
                const pokemon = data as Pokemon;
                const { id, name } = pokemon;
                return /*html*/ `
                    <div
                        style="
                            display: flex;
                            flex-direction: row;
                            margin: 0 -19px;
                            gap: 4px;
                            align-items: center;
                            justify-content: center;
                            align-content: center;
                            height: 100%;
                        "
                    >
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
                            alt="${name}"
                            style="height: 3.5rem;"
                            onerror="this.style.display='none';"
                        />
                    </div>
                `;
            }
        },
        {
            field: 'id',
            filter: false,
            maxWidth: 90,
            minWidth: 90,
            valueFormatter: ({ value }) => `#${value.toString().padStart(4, '0')}`,
            cellRenderer: ({ value }) => {
                const id = `#${value.toString().padStart(4, '0')}`;
                const href = `https://pokemondb.net/pokedex/${value}`;
                return /*html*/ `
                    <a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${id}</a>
                `;
            }
        },
        {
            field: 'name',
            headerName: 'Name',
            filter: 'agTextColumnFilter',
            floatingFilter: false,
            minWidth: 220,
            maxWidth: 220,
            valueFormatter: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1)
            // cellRenderer: ({ data }) => {
            //     const pokemon = data as Pokemon;
            //     const { id, name } = pokemon;
            //     return /*html*/ `
            //         <div
            //             style="
            //                 display: flex;
            //                 flex-direction: row;
            //                 gap: 4px;
            //                 align-items: center;
            //                 justify-content: flex-start;
            //                 align-content: center;
            //                 height: 100%;
            //             "
            //         >
            //             <img
            //                 src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
            //                 alt="${name}"
            //                 style="height: 4rem; margin-left: -.85rem;"
            //                 onerror="this.style.display='none';"
            //             />
            //             <span>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
            //         </div>
            //     `;
            // }
        },

        // Types
        {
            field: 'types',
            filter: 'agTextColumnFilter',
            floatingFilter: false,
            minWidth: 130,
            maxWidth: 130,
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
                            <img src="/pokebase/static/types/${lang}/${id}.png" alt="${id}" style="height: 18px;"/>
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
        },

        // Moves
        {
            field: 'moves',
            filter: 'agTextColumnFilter',
            headerName: 'Search moves',
            floatingFilter: false,
            valueFormatter: ({ context, value }) => {
                const count = value.length;
                return `${count} move${count !== 1 ? 's' : ''} total`;
            },
            filterValueGetter: ({ data }) => {
                return data?.moves.map((move) => move.name).join(', ');
            },
            minWidth: 170,
            maxWidth: 170
        },

        // Stats
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
                    floatingFilter: false,
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
                            floatingFilter: false,
                            minWidth: 120,
                            maxWidth: 120
                        } as ColDef<PokemonTableRow>)
                )
            ]
        }
    ];
}

const createEffectivenessColumn = (props: {
    name?: string;
    category: EffectivenessCategory;
    types: Awaited<FindTypesResponse>;
}): ColDef<PokemonTableRow> => {
    const { name = '', category, types } = props;
    return {
        field: `types.effectiveness.${category}`,
        headerName: `${name} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        filter: 'agTextColumnFilter',
        columnGroupShow: 'open',
        floatingFilter: false,
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
                        <img src="/pokebase/static/types/icons/${id}.svg" alt="${id}" style="height: 18px;"/>
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

export class LogoHeaderComponent implements IHeaderComp {
    eGui!: HTMLElement;

    refresh(params: IHeaderParams): boolean {
        return false;
    }

    getGui(): HTMLElement {
        return this.eGui;
    }

    init(params: any): void {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = /*html*/ `
            <div class="flex items-center justify-center h-full p-0 w-full">
                <img src="/pokebase/static/pokeball.svg" alt="Logo" class="w-8" />
            </div>
        `;
    }
}
