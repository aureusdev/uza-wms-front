import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenService } from '../services/tokenService';

// HTTP Link para conectar con el backend GraphQL
const httpLink = createHttpLink({
   uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

// Auth Link para agregar el token JWT a cada request
const authLink = setContext((_, { headers }) => {
   const token = TokenService.getAccessToken();

   return {
      headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : '',
      },
   };
});

// Error Link para manejar errores de autenticación
const errorLink = onError(({ graphQLErrors, networkError }) => {
   if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
         console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
         );

         // Si el token expiró, intentar refrescarlo
         if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized')) {
            TokenService.handleTokenExpiration();
         }
      });
   }

   if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      // Manejar errores 401 (Unauthorized)
      if ('statusCode' in networkError && networkError.statusCode === 401) {
         TokenService.handleTokenExpiration();
      }
   }
});

// Cliente Apollo configurado
export const apolloClient = new ApolloClient({
   link: from([errorLink, authLink, httpLink]),
   cache: new InMemoryCache({
      typePolicies: {
         Query: {
            fields: {
               // Configurar políticas de cache si es necesario
            },
         },
      },
   }),
   defaultOptions: {
      watchQuery: {
         errorPolicy: 'all',
      },
      query: {
         errorPolicy: 'all',
      },
   },
});