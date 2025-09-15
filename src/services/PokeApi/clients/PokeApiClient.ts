import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';

export const PokeApiClient = new ApolloClient({
    link: ApolloLink.from([
        new RemoveTypenameFromVariablesLink(),
        new HttpLink({ uri: 'https://graphql.pokeapi.co/v1beta2/' })
    ]),
    cache: new InMemoryCache({})
});
