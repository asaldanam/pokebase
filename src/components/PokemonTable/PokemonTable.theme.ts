import {
    colorSchemeDark,
    colorSchemeLight,
    colorSchemeVariable,
    iconSetQuartzLight,
    themeAlpine,
    type GridOptions
} from 'ag-grid-community';
import type { PokemonTableRow } from './PokemonTable.data';

export function createPokemonTableTheme(props: { mode: 'light' | 'dark' }): GridOptions<PokemonTableRow>['theme'] {
    const { mode } = props;

    return themeAlpine
        .withParams({
            spacing: 10,
            accentColor: 'red',
            borderRadius: 0,
            wrapperBorderRadius: 0,
            wrapperBorder: 'none',
            columnBorder: '1px solid var(--ag-border-color)'
        })
        .withPart((mode === 'light' && colorSchemeLight) || (mode === 'dark' && colorSchemeDark) || colorSchemeVariable)
        .withPart(iconSetQuartzLight);
}
