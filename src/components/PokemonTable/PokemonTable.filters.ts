import type { GridApi, FilterChangedEvent } from 'ag-grid-community';
import type { FindStatsResponse, FindTypesResponse } from '@services/PokeApi';

export interface FilterPillsManager {
    init(containerId: string, gridApi: GridApi): void;
    onFilterChanged(event: FilterChangedEvent): void;
    destroy(): void;
}

export function createFilterPillsManager(props: {
    stats: Awaited<FindStatsResponse>;
    types: Awaited<FindTypesResponse>;
}): FilterPillsManager {
    const { stats, types } = props;

    let container: HTMLElement | null = null;
    let gridApi: GridApi | null = null;
    let activeFilters: Map<string, any> = new Map();

    // Mapeo de nombres de columnas
    function getColumnDisplayName(colId: string): string {
        const columnMap: Record<string, string> = {
            name: 'Name',
            types: 'Types',
            moves: 'Moves',
            'stats.total': 'Total Stats',
            'stats.1': stats[1]?.name || 'HP',
            'stats.2': stats[2]?.name || 'Attack',
            'stats.3': stats[3]?.name || 'Defense',
            'stats.4': stats[4]?.name || 'Sp. Attack',
            'stats.5': stats[5]?.name || 'Sp. Defense',
            'stats.6': stats[6]?.name || 'Speed',
            id: 'ID'
        };

        if (colId.includes('types.effectiveness')) {
            const parts = colId.split('.');
            const category = parts[parts.length - 1];
            const categoryMap: Record<string, string> = {
                double: 'Weak 2x',
                quadruple: 'Weak 4x',
                half: 'Resi 1/2x',
                quarter: 'Resi 1/4x',
                immune: 'Inmunity'
            };
            return categoryMap[category] || `${category.charAt(0).toUpperCase() + category.slice(1)} Effectiveness`;
        }

        return columnMap[colId] || colId;
    }

    // Mapeo de tipos de filtro
    function getFilterTypeDisplayName(filterType: string): string {
        const filterTypeMap: Record<string, string> = {
            equals: 'Equals',
            notEqual: 'Does not equal',
            contains: 'Contains',
            notContains: 'Does not contain',
            startsWith: 'Begins with',
            endsWith: 'Ends with',
            greaterThan: 'Greater than',
            greaterThanOrEqual: 'Greater than or equal',
            lessThan: 'Less than',
            lessThanOrEqual: 'Less than or equal',
            inRange: 'In range',
            blank: 'Is blank',
            notBlank: 'Is not blank'
        };
        return filterTypeMap[filterType] || filterType;
    }

    // Formatear valores de filtro
    function formatFilterValue(value: any): string {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'object' && value !== null) {
            if (value.from !== undefined && value.to !== undefined) {
                return `${value.from} - ${value.to}`;
            }
            return JSON.stringify(value);
        }
        return String(value);
    }

    // Crear un pill individual
    function createFilterPill(colId: string, filterType: string, filterValue: any): HTMLElement {
        const pill = document.createElement('div');
        pill.className = 'bg-white text-red-600 px-2 py-1 gap-2 flex items-center text-sm shadow-sm my-3 rounded-md';

        const columnName = getColumnDisplayName(colId);
        let contentHtml: string;

        // Manejar filtros combinados (múltiples condiciones)
        if (filterType === 'combined') {
            const { conditions, operator } = filterValue;
            const conditionsHtml = conditions
                .map((condition: any) => {
                    const filterTypeName = getFilterTypeDisplayName(condition.type);
                    const value = formatFilterValue(condition.filter);
                    return `<span class="uppercase">${filterTypeName}</span> <span class="font-bold capitalize">${value}</span>`;
                })
                .join(` <span class="uppercase">${operator}</span> `);

            contentHtml = conditionsHtml;
        } else {
            const filterTypeName = getFilterTypeDisplayName(filterType);
            let formattedValue = formatFilterValue(filterValue);

            // Truncar valores muy largos para filtros individuales
            if (formattedValue.length > 20) {
                formattedValue = formattedValue.substring(0, 17) + '...';
            }

            contentHtml = `<span class="uppercase text-xs opacity-75">${filterTypeName}</span> <span class="font-bold capitalize">${formattedValue}</span>`;
        }

        pill.innerHTML = `
			<div class="flex gap-1 items-center">
				<span class="font-bold">${columnName}</span>
				<span class="text-xs">${contentHtml}</span>
			</div>
			<button 
				class="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold transition-colors" 
				data-col-id="${colId}"
				title="Eliminar filtro"
			>&times;</button>
		`;

        // Añadir evento para eliminar el filtro
        const removeButton = pill.querySelector('button');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                removeFilter(colId);
            });
        }

        return pill;
    } // Extraer filtros del modelo
    function extractFiltersFromModel(filterModel: any): Array<{ colId: string; filterType: string; filterValue: any }> {
        const filters: Array<{ colId: string; filterType: string; filterValue: any }> = [];

        Object.entries(filterModel).forEach(([colId, filter]: [string, any]) => {
            if (!filter) return;

            // Manejar filtros con conditions array (AND/OR)
            if (filter.conditions && Array.isArray(filter.conditions)) {
                // Pasar las condiciones completas para procesamiento en el pill
                const operator = filter.operator || 'AND';
                const validConditions = filter.conditions.filter(
                    (condition: any) =>
                        condition &&
                        condition.filter !== undefined &&
                        condition.filter !== null &&
                        condition.filter !== ''
                );

                if (validConditions.length > 0) {
                    filters.push({
                        colId,
                        filterType: 'combined',
                        filterValue: { conditions: validConditions, operator }
                    });
                }
            }
            // Manejar agMultiColumnFilter (filtros múltiples)
            else if (filter.filterType === 'multi') {
                Object.entries(filter).forEach(([key, condition]: [string, any]) => {
                    if (
                        key.startsWith('condition') &&
                        condition &&
                        condition.filter !== undefined &&
                        condition.filter !== null &&
                        condition.filter !== ''
                    ) {
                        filters.push({
                            colId,
                            filterType: condition.type,
                            filterValue: condition.filter
                        });
                    }
                });
            }
            // Manejar filtros simples
            else if (filter.filterType || filter.type) {
                const filterType = filter.type || filter.filterType;
                const filterValue = filter.filter || filter.value;

                if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
                    filters.push({ colId, filterType, filterValue });
                }
            }
            // Manejar filtros con condition1 y condition2
            else if (filter.condition1 || filter.condition2) {
                if (
                    filter.condition1 &&
                    filter.condition1.filter !== undefined &&
                    filter.condition1.filter !== null &&
                    filter.condition1.filter !== ''
                ) {
                    filters.push({
                        colId,
                        filterType: filter.condition1.type,
                        filterValue: filter.condition1.filter
                    });
                }
                if (
                    filter.condition2 &&
                    filter.condition2.filter !== undefined &&
                    filter.condition2.filter !== null &&
                    filter.condition2.filter !== ''
                ) {
                    filters.push({
                        colId,
                        filterType: filter.condition2.type,
                        filterValue: filter.condition2.filter
                    });
                }
            }
            // Manejar set filters
            else if (filter.values) {
                const selectedValues = filter.values.filter((v: any) => v !== null && v !== undefined);
                if (selectedValues.length > 0) {
                    filters.push({ colId, filterType: 'in', filterValue: selectedValues });
                }
            }
        });

        return filters;
    }

    // Renderizar todos los pills
    function renderFilterPills(): void {
        if (!container || !gridApi) return;

        container.innerHTML = '';

        const filterModel = gridApi.getFilterModel();
        const filters = extractFiltersFromModel(filterModel);

        filters.forEach(({ colId, filterType, filterValue }) => {
            const pill = createFilterPill(colId, filterType, filterValue);
            container!.appendChild(pill);
        });
    }

    // Eliminar un filtro
    function removeFilter(colId: string): void {
        if (!gridApi) return;

        gridApi.setColumnFilterModel(colId, null);
        gridApi.onFilterChanged();
    }

    // API pública
    return {
        init(containerId: string, api: GridApi): void {
            container = document.getElementById(containerId);
            gridApi = api;
            activeFilters.clear();
        },

        onFilterChanged(event: FilterChangedEvent): void {
            if (!gridApi) return;

            activeFilters.clear();
            const filterModel = gridApi.getFilterModel();

            Object.entries(filterModel).forEach(([colId, filter]) => {
                if (filter) {
                    activeFilters.set(colId, filter);
                }
            });

            renderFilterPills();
        },

        destroy(): void {
            if (container) {
                container.innerHTML = '';
            }
            container = null;
            gridApi = null;
            activeFilters.clear();
        }
    };
}
