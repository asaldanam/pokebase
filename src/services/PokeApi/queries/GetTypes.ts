import { gql } from '@apollo/client';

import { PokeApiClient } from '../clients/PokeApiClient';
import { Type } from '../models/Type';
import type { GetTypesQuery, GetTypesQueryVariables } from '../types/PokeApiTypes';

// Query con nombre para generar tipos específicos
export const GET_TYPES = gql`
    query GetTypes($lang: String = "es") {
        results: type {
            id
            typenames(where: { language: { name: { _in: [$lang, "en"] } } }) {
                name
                language {
                    name
                }
            }
            typeefficacies {
                target_type_id
                damage_factor
            }
        }
    }
`;

export const GetTypes = async (params: { lang?: string; gen?: number }) => {
    const { lang = 'es' } = params;
    const response = await PokeApiClient.query<GetTypesQuery, GetTypesQueryVariables>({
        query: GET_TYPES,
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
