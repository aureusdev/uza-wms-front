import { useQuery, type QueryHookOptions, ApolloError, type FetchResult } from '@apollo/client'
import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { GET_WAREHOUSES, GET_WAREHOUSE } from '../graphql/warehouse.queries'
import type {
   Warehouse,
   WarehouseFilters,
   PaginationInfo,
   GetWarehousesData,
   GetWarehousesVars,
   GetWarehouseData,
   GetWarehouseVars,
} from '../types/warehouse.types'

// ===============================
// CACHE Y PERSISTENCIA
// ===============================

const CACHE_KEY = 'warehouse_filters_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CachedFilters {
   filters: WarehouseFilters;
   timestamp: number;
}

const saveFiltersToCache = (filters: WarehouseFilters) => {
   try {
      const cached: CachedFilters = {
         filters,
         timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
   } catch (error) {
      console.warn('No se pudieron guardar los filtros en cache:', error);
   }
};

const loadFiltersFromCache = (): WarehouseFilters | null => {
   try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedFilters = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
      
      if (isExpired) {
         sessionStorage.removeItem(CACHE_KEY);
         return null;
      }

      return parsed.filters;
   } catch (error) {
      console.warn('Error al cargar filtros del cache:', error);
      return null;
   }
};

// ===============================
// HOOK PRINCIPAL PARA LISTA DE WAREHOUSES
// ===============================

interface UseWarehousesProps {
   page?: number
   limit?: number
   filters?: WarehouseFilters
   options?: QueryHookOptions<GetWarehousesData, GetWarehousesVars>
   enableAutoRefetch?: boolean
   enableCaching?: boolean
   pollingInterval?: number
}

interface UseWarehousesResult {
   warehouses: Warehouse[]
   pagination: PaginationInfo
   loading: boolean
   error?: ApolloError
   errorMessage?: string
   networkStatus: number
   refetch: (vars?: Partial<GetWarehousesVars>) => Promise<FetchResult<GetWarehousesData>>
   loadMore: (newPage: number) => Promise<FetchResult<GetWarehousesData> | void>
   hasNextPage: boolean
   hasPreviousPage: boolean
   isRefetching: boolean
   isEmpty: boolean
   hasFilters: boolean
   lastFetch: Date | null
   isCacheHit: boolean
}

export function useWarehouses({
   page = 1,
   limit = 20,
   filters = {},
   options = {},
   enableAutoRefetch = true,
   enableCaching = true,
   pollingInterval = 0, // 0 = sin polling automático
}: UseWarehousesProps): UseWarehousesResult {
   // Referencias para cancelación de requests
   const abortControllerRef = useRef<AbortController | null>(null)
   const previousFiltersRef = useRef<WarehouseFilters>(filters)
   const [lastFetch, setLastFetch] = useState<Date | null>(null)
   const [isCacheHit, setIsCacheHit] = useState(false)

   // 1️⃣ Memoriza las variables para evitar re-fetches innecesarios
   const variables = useMemo(
      () => ({ filters: { page, limit, ...filters } }),
      [page, limit, filters]
   )

   // 1.5️⃣ Determinar política de fetch basada en cache
   const fetchPolicy = useMemo(() => {
      if (!enableCaching) return 'cache-and-network';
      
      const cachedFilters = loadFiltersFromCache();
      const hasRecentCache = cachedFilters && 
         JSON.stringify(cachedFilters) === JSON.stringify(filters);
      
      return hasRecentCache ? 'cache-first' : 'cache-and-network';
   }, [filters, enableCaching]);

   // 2️⃣ Detecta si hay filtros activos
   const hasFilters = useMemo(() => {
      return Boolean(
         filters.search ||
         filters.type ||
         filters.withDeleted ||
         filters.onlyDeleted ||
         (filters.sortBy && filters.sortBy !== 'createdAt') ||
         (filters.sortOrder && filters.sortOrder !== 'DESC')
      )
   }, [filters])

   // 3️⃣ Ejecuta la query principal con cancelación
   const {
      data,
      loading,
      error,
      refetch,
      fetchMore,
      networkStatus,
      startPolling,
      stopPolling,
   } = useQuery<GetWarehousesData, GetWarehousesVars>(GET_WAREHOUSES, {
      variables,
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
      fetchPolicy,
      pollInterval: pollingInterval,
      onCompleted: (data) => {
         setLastFetch(new Date());
         setIsCacheHit(false);
         if (enableCaching) {
            saveFiltersToCache(filters);
         }
      },
      onError: () => {
         setIsCacheHit(false);
      },
      ...options,
   })

   // 3.5️⃣ Detectar cache hits
   useEffect(() => {
      if (data && !loading && networkStatus === 7) { // NetworkStatus.ready
         const wasFromCache = !lastFetch || (Date.now() - lastFetch.getTime()) > 1000;
         setIsCacheHit(wasFromCache);
      }
   }, [data, loading, networkStatus, lastFetch]);

   // 4️⃣ Callback estable para paginar más resultados
   const loadMore = useCallback(
      (newPage: number) => {
         // Cancelar request anterior si existe
         if (abortControllerRef.current) {
            abortControllerRef.current.abort()
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController()

         return fetchMore({
            variables: {
               filters: { page: newPage, limit, ...filters },
            },
            updateQuery: (prev, { fetchMoreResult }) => {
               if (!fetchMoreResult) return prev

               return {
                  warehouses: {
                     meta: fetchMoreResult.warehouses.meta,
                     items: [...prev.warehouses.items, ...fetchMoreResult.warehouses.items],
                  },
               }
            },
         })
      },
      [limit, filters, fetchMore]
   )

   // 4.5️⃣ Control inteligente de polling
   useEffect(() => {
      if (pollingInterval > 0 && !loading && !error) {
         startPolling(pollingInterval);
      } else {
         stopPolling();
      }

      return () => stopPolling();
   }, [pollingInterval, loading, error, startPolling, stopPolling]);

   // 5️⃣ Extrae metadatos de forma segura
   const meta = data?.warehouses.meta
   const pagination: PaginationInfo = {
      total: meta?.totalItems ?? 0,
      page: meta?.currentPage ?? page,
      totalPages: meta?.totalPages ?? 0,
      limit: meta?.itemsPerPage ?? limit,
      itemCount: meta?.itemCount ?? 0,
   }

   // 6️⃣ Cálculos de navegación y estado
   const hasNextPage = pagination.page < pagination.totalPages
   const hasPreviousPage = pagination.page > 1
   const isEmpty = !loading && !error && (data?.warehouses.items?.length ?? 0) === 0
   const isRefetching = networkStatus === 4 // NetworkStatus.refetch

   // 7️⃣ Mensaje de error amigable para la UI
   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join(' ') || error.message
      : undefined

   // 8️⃣ Refetch mejorado con cancelación al cambiar filtros
   const enhancedRefetch = useCallback(
      (vars?: Partial<GetWarehousesVars>) => {
         setIsCacheHit(false);
         
         // Cancelar request anterior si existe
         if (abortControllerRef.current) {
            abortControllerRef.current.abort()
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController()

         setLastFetch(new Date());
         return refetch(vars)
      },
      [refetch]
   )

   // 9️⃣ Refetch automático al cambiar filtros (con optimización)
   useEffect(() => {
      if (!enableAutoRefetch) return;

      // Comparar filtros para evitar refetch innecesario
      const filtersChanged = JSON.stringify(previousFiltersRef.current) !== JSON.stringify(filters);
      
      // Verificar si hay cache reciente para estos filtros
      const cachedFilters = enableCaching ? loadFiltersFromCache() : null;
      const hasRecentCache = cachedFilters && 
         JSON.stringify(cachedFilters) === JSON.stringify(filters);

      // Solo hacer refetch si los filtros cambiaron Y no hay cache reciente
      if (filtersChanged && Object.keys(filters).length > 0 && !hasRecentCache) {
         // Cancelar request anterior
         if (abortControllerRef.current) {
            abortControllerRef.current.abort()
         }

         // Crear nuevo AbortController
         abortControllerRef.current = new AbortController()

         // Refetch con página 1 cuando cambian los filtros
         enhancedRefetch({ filters: { page: 1, limit, ...filters } })

         // Actualizar referencia
         previousFiltersRef.current = filters
         
         // Guardar en cache
         if (enableCaching) {
            saveFiltersToCache(filters);
         }
      }
   }, [filters, limit, enhancedRefetch, enableAutoRefetch, enableCaching])

   // 🔟 Cleanup al desmontar
   useEffect(() => {
      return () => {
         if (abortControllerRef.current) {
            abortControllerRef.current.abort()
         }
      }
   }, [])

   return {
      warehouses: data?.warehouses.items ?? [],
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
      lastFetch,
      isCacheHit,
   }
}

// ===============================
// HOOK PARA UN WAREHOUSE ESPECÍFICO
// ===============================

interface UseWarehouseProps {
   id: number
   skip?: boolean
   options?: QueryHookOptions<GetWarehouseData, GetWarehouseVars>
}

interface UseWarehouseResult {
   warehouse?: Warehouse
   loading: boolean
   error?: ApolloError
   errorMessage?: string
   refetch: () => Promise<FetchResult<GetWarehouseData>>
}

export function useWarehouse({ id, skip = false, options }: UseWarehouseProps): UseWarehouseResult {
   const {
      data,
      loading,
      error,
      refetch,
   } = useQuery<GetWarehouseData, GetWarehouseVars>(GET_WAREHOUSE, {
      variables: { id },
      skip: skip || !id,
      errorPolicy: 'all',
      ...options,
   })

   const errorMessage = error
      ? error.graphQLErrors.map(e => e.message).join(' ') || error.message
      : undefined

   return {
      warehouse: data?.warehouse,
      loading,
      error,
      errorMessage,
      refetch,
   }
}