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
               // Configurar políticas de cache optimizadas
               warehouses: {
                  // Cache por 5 minutos para warehouses
                  merge(existing, incoming, { args }) {
                     // Si es la misma consulta, reemplazar completamente
                     if (existing && args?.filters) {
                        const existingFilters = existing.__args?.filters;
                        const incomingFilters = args.filters;
                        
                        if (JSON.stringify(existingFilters) === JSON.stringify(incomingFilters)) {
                           return incoming;
                        }
                     }
                     
                     return incoming;
                  },
                  read(existing, { args }) {
                     // Leer desde cache si los datos son recientes (< 5 minutos)
                     if (existing && existing.__timestamp) {
                        const age = Date.now() - existing.__timestamp;
                        if (age < 5 * 60 * 1000) { // 5 minutos
                           return existing;
                        }
                     }
                     return existing;
                  }
               },
               items: {
                  // Cache similar para items
                  merge(existing, incoming, { args }) {
                     if (existing && args?.filters) {
                        const existingFilters = existing.__args?.filters;
                        const incomingFilters = args.filters;
                        
                        if (JSON.stringify(existingFilters) === JSON.stringify(incomingFilters)) {
                           return incoming;
                        }
                     }
                     
                     return incoming;
                  }
               },
               containers: {
                  // Cache similar para containers
                  merge(existing, incoming, { args }) {
                     if (existing && args?.filters) {
                        const existingFilters = existing.__args?.filters;
                        const incomingFilters = args.filters;
                        
                        if (JSON.stringify(existingFilters) === JSON.stringify(incomingFilters)) {
                           return incoming;
                        }
                     }
                     
                     return incoming;
                  }
               }
            },
         },
         Warehouse: {
            fields: {
               // Configurar merge para campos específicos si es necesario
            }
         },
         Item: {
            fields: {
               // Configurar merge para campos específicos si es necesario  
            }
         },
         Container: {
            fields: {
               // Configurar merge para campos específicos si es necesario
            }
         }
      },
   }),
   defaultOptions: {
      watchQuery: {
         errorPolicy: 'all',
         // Cache-first por defecto para mejor rendimiento
         fetchPolicy: 'cache-first',
         // Tiempo de cache más largo para datos que cambian poco
         pollInterval: 0, // Sin polling automático por defecto
      },
      query: {
         errorPolicy: 'all',
         fetchPolicy: 'cache-first',
      },
      mutate: {
         errorPolicy: 'all',
         // Optimistic response habilitado para mejor UX
      }
   },
});