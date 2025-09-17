import { PokeApiClient } from '../clients/PokeApiClient';
import { Type } from '../models/Type';
import { GetTypes } from '../queries/GetTypes';
import type { GetTypesQuery, GetTypesQueryVariables } from '../types/PokeApiTypes';

export const findTypes = async (params: { lang?: string; gen?: number }) => {
    const { lang = 'es' } = params;
    const response = await PokeApiClient.query<GetTypesQuery, GetTypesQueryVariables>({
        query: GetTypes,
        variables: { lang },
        errorPolicy: 'all'
    });

    if (response.error) throw new Error(`Error fetching types: ${response.error.message}`);
    if (!response.data?.results) throw new Error(`No data returned for types`);

    const types = response.data.results
        .map((data) => Type.fromQuery(data))
        .reduce((types, type) => ({ ...types, [type.id.toString()]: type }), {} as Record<string, Type>);

    return types;
};
