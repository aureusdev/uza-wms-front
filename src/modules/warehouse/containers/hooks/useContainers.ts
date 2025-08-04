import { useQuery, type QueryHookOptions, ApolloError, type FetchResult } from "@apollo/client";
import { useMemo, useCallback, useEffect, useRef } from "react";
import { GET_CONTAINERS, GET_CONTAINER } from "../graphql/container.queries";
import type {
   Container,
   ContainerFilters,
   PaginationInfo,
   GetContainersData,
   GetContainersVars,
   GetContainerData,
   GetContainerVars,
} from "../types/container.types";

// ===============================
// HOOK PRINCIPAL PARA LISTA DE CONTENEDORES
// ===============================

interface UseContainersProps {
   page?: number;
   limit?: number;
   filters?: ContainerFilters;
   options?: QueryHookOptions<GetContainersData, GetContainersVars>;
   enableAutoRefetch?: boolean;
}

interface UseContainersResult {
   containers: Container[];
   pagination: PaginationInfo;
   loading: boolean;
   error?: ApolloError;
   errorMessage?: string;
   networkStatus: number;
   refetch: (vars?: Partial<GetContainersVars>) => Promise<FetchResult<GetContainersData>>;
   loadMore: (newPage: number) => Promise<FetchResult<GetContainersData> | void>;
   hasNextPage: boolean;
   hasPreviousPage: boolean;
   isRefetching: boolean;
   isEmpty: boolean;
   hasFilters: boolean;
}

export function useContainers({
   page = 1,
   limit = 20,
   filters = {},
   options = {},
   enableAutoRefetch = true,
}: UseContainersProps): UseContainersResult {
   // Referencias para cancelación de requests
   const abortControllerRef = useRef<AbortController | null>(null);
   const previousFiltersRef = useRef<ContainerFilters>(filters);

   // 1️⃣ Memoriza las variables para evitar re-fetches innecesarios
   const variables = useMemo(
      () => ({ filters: { page, limit, ...filters } }),
      [page, limit, filters]
   );

   // 2️⃣ Detecta si hay filtros activos
   const hasFilters = useMemo(() => {
      return Boolean(
         filters.search ||
         filters.status ||
         filters.withDeleted ||
         filters.onlyDeleted ||
         (filters.sortBy && filters.sortBy !== 'createdAt') ||
         (filters.sortOrder && filters.sortOrder !== 'DESC')
      );
   }, [filters]);

   // 3️⃣ Ejecuta la query principal con cancelación
   const {
      data,
      loading,
      error,
      refetch,
      fetchMore,
      networkStatus,
   } = useQuery<GetContainersData, GetContainersVars>(GET_CONTAINERS, {
      variables,
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      fetchPolicy: 'cache-and-network',
      ...options,
   });

   // 4️⃣ Callback estable para paginar más resultados
   const loadMore = useCallback(
      (newPage: number) => {
         // Cancelar request anterior si existe
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController();

         return fetchMore({
            variables: {
               filters: { page: newPage, limit, ...filters },
            },
            updateQuery: (prev, { fetchMoreResult }) => {
               if (!fetchMoreResult) return prev;

               return {
                  containers: {
                     meta: fetchMoreResult.containers.meta,
                     items: [...prev.containers.items, ...fetchMoreResult.containers.items],
                  },
               };
            },
         });
      },
      [limit, filters, fetchMore]
   );

   // 5️⃣ Extrae metadatos de forma segura
   const meta = data?.containers.meta;
   const pagination: PaginationInfo = {
      total: meta?.totalItems ?? 0,
      page: meta?.currentPage ?? page,
      totalPages: meta?.totalPages ?? 0,
      limit: meta?.itemsPerPage ?? limit,
      itemCount: meta?.itemCount ?? 0,
   };

   // 6️⃣ Cálculos de navegación y estado
   const hasNextPage = pagination.page < pagination.totalPages;
   const hasPreviousPage = pagination.page > 1;
   const isEmpty = !loading && !error && (data?.containers.items?.length ?? 0) === 0;
   const isRefetching = networkStatus === 4; // NetworkStatus.refetch

   // 7️⃣ Mensaje de error amigable para la UI
   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join("; ") || error.message
      : undefined;

   // 8️⃣ Refetch mejorado con cancelación al cambiar filtros
   const enhancedRefetch = useCallback(
      (vars?: Partial<GetContainersVars>) => {
         // Cancelar request anterior si existe
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController();

         return refetch(vars);
      },
      [refetch]
   );

   // 9️⃣ Refetch automático al cambiar filtros (con optimización)
   useEffect(() => {
      if (!enableAutoRefetch) return;

      // Comparar filtros para evitar refetch innecesario
      const filtersChanged = JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters);

      if (filtersChanged && Object.keys(filters).length > 0) {
         // Cancelar request anterior
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController();

         // Refetch con página 1 cuando cambian los filtros
         enhancedRefetch({ filters: { page: 1, limit, ...filters } });

         // Actualizar referencia
         previousFiltersRef.current = filters;
      }
   }, [filters, limit, enhancedRefetch, enableAutoRefetch]);

   // 🔟 Cleanup al desmontar
   useEffect(() => {
      return () => {
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }
      };
   }, []);

   return {
      containers: data?.containers.items ?? [],
      pagination,
      loading,
      error,
      errorMessage,
      networkStatus,
      refetch: enhancedRefetch,
      loadMore,
      hasNextPage,
      hasPreviousPage,
      isRefetching,
      isEmpty,
      hasFilters,
   };
}

// ===============================
// HOOK PARA UN CONTENEDOR ESPECÍFICO
// ===============================

interface UseContainerProps {
   id: number;
   skip?: boolean;
   options?: QueryHookOptions<GetContainerData, GetContainerVars>;
}

interface UseContainerResult {
   container?: Container;
   loading: boolean;
   error?: ApolloError;
   errorMessage?: string;
   refetch: () => Promise<FetchResult<GetContainerData>>;
}

export function useContainer({ id, skip = false, options }: UseContainerProps): UseContainerResult {
   const {
      data,
      loading,
      error,
      refetch,
   } = useQuery<GetContainerData, GetContainerVars>(GET_CONTAINER, {
      variables: { id },
      skip: skip || !id,
      errorPolicy: "all",
      ...options,
   });

   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join("; ") || error.message
      : undefined;

   return {
      container: data?.container,
      loading,
      error,
      errorMessage,
      refetch,
   };
}