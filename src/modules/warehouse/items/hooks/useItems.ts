import { useQuery, type QueryHookOptions, ApolloError, type FetchResult } from "@apollo/client";
import { useMemo, useCallback, useEffect, useRef } from "react";
import { GET_ITEMS, GET_ITEM } from "../graphql/item.queries";
import type {
   Item,
   ItemFilters,
   PaginationInfo,
   GetItemsData,
   GetItemsVars,
   GetItemData,
   GetItemVars,
} from "../types/item.types";

// ===============================
// HOOK PRINCIPAL PARA LISTA DE ITEMS
// ===============================

interface UseItemsProps {
   page?: number;
   limit?: number;
   filters?: ItemFilters;
   options?: QueryHookOptions<GetItemsData, GetItemsVars>;
   enableAutoRefetch?: boolean;
}

interface UseItemsResult {
   items: Item[];
   pagination: PaginationInfo;
   loading: boolean;
   error?: ApolloError;
   errorMessage?: string;
   networkStatus: number;
   refetch: (vars?: Partial<GetItemsVars>) => Promise<FetchResult<GetItemsData>>;
   loadMore: (newPage: number) => Promise<FetchResult<GetItemsData> | void>;
   hasNextPage: boolean;
   hasPreviousPage: boolean;
   isRefetching: boolean;
   isEmpty: boolean;
   hasFilters: boolean;
}

export function useItems({
   page = 1,
   limit = 20,
   filters = {},
   options = {},
   enableAutoRefetch = true,
}: UseItemsProps): UseItemsResult {
   // Referencias para cancelación de requests
   const abortControllerRef = useRef<AbortController | null>(null);
   const previousFiltersRef = useRef<ItemFilters>(filters);

   // 1️⃣ Memoriza las variables para evitar re-fetches innecesarios
   const variables = useMemo(
      () => ({ filters: { page, limit, ...filters } }),
      [page, limit, filters]
   );

   // 2️⃣ Detecta si hay filtros activos
   const hasFilters = useMemo(() => {
      return Boolean(
         filters.search ||
         filters.minPrice !== undefined ||
         filters.maxPrice !== undefined ||
         filters.itemCategoryId ||
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
   } = useQuery<GetItemsData, GetItemsVars>(GET_ITEMS, {
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
                  items: {
                     meta: fetchMoreResult.items.meta,
                     items: [...prev.items.items, ...fetchMoreResult.items.items],
                  },
               };
            },
         });
      },
      [limit, filters, fetchMore]
   );

   // 5️⃣ Extrae metadatos de forma segura
   const meta = data?.items.meta;
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
   const isEmpty = !loading && !error && (data?.items.items?.length ?? 0) === 0;
   const isRefetching = networkStatus === 4; // NetworkStatus.refetch

   // 7️⃣ Mensaje de error amigable para la UI
   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join("; ") || error.message
      : undefined;

   // 8️⃣ Refetch mejorado con cancelación al cambiar filtros
   const enhancedRefetch = useCallback(
      (vars?: Partial<GetItemsVars>) => {
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
      items: data?.items.items ?? [],
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
// HOOK PARA UN ITEM ESPECÍFICO
// ===============================

interface UseItemProps {
   id: number;
   skip?: boolean;
   options?: QueryHookOptions<GetItemData, GetItemVars>;
}

interface UseItemResult {
   item?: Item;
   loading: boolean;
   error?: ApolloError;
   errorMessage?: string;
   refetch: () => Promise<FetchResult<GetItemData>>;
}

export function useItem({ id, skip = false, options }: UseItemProps): UseItemResult {
   const {
      data,
      loading,
      error,
      refetch,
   } = useQuery<GetItemData, GetItemVars>(GET_ITEM, {
      variables: { id },
      skip: skip || !id,
      errorPolicy: "all",
      ...options,
   });

   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join("; ") || error.message
      : undefined;

   return {
      item: data?.item,
      loading,
      error,
      errorMessage,
      refetch,
   };
}
