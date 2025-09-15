import { ApolloLink } from '@apollo/client';
import { InMemoryCache, HttpLink, ApolloClient, gql } from '@apollo/client';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';

const client = new ApolloClient({
    link: ApolloLink.from([
        new RemoveTypenameFromVariablesLink(),
        new HttpLink({ uri: 'https://graphql.pokeapi.co/v1beta2/' })
    ]),
    cache: new InMemoryCache({})
});

export class PokeApi {
    static pokemon() {
        return client.query({
            query: gql`
                query samplePokeAPIquery {
                    pokemon: pokemon(limit: 1) {
                        name
                        pokemonmoves {
                            move {
                                id
                                name
                            }
                        }
                    }
                }
            `,
            errorPolicy: 'all'
        });
    }
}
