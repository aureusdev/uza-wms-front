import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type {
   UnifiedWarehouseFilters,
   WarehouseFilters,
   UseUnifiedWarehouseFiltersOptions,
   UseUnifiedWarehouseFiltersReturn,
   WarehouseType
} from '../types/warehouse.types'

const defaultFilters: UnifiedWarehouseFilters = {
   search: undefined,
   type: undefined,
   withDeleted: false,
   onlyDeleted: false,
   sortBy: 'createdAt',
   sortOrder: 'DESC'
}

export function useUnifiedWarehouseFilters({
   initialFilters = {},
   debounceMs = 300
}: UseUnifiedWarehouseFiltersOptions = {}): UseUnifiedWarehouseFiltersReturn {

   const [filters, setFilters] = useState<UnifiedWarehouseFilters>({
      ...defaultFilters,
      ...initialFilters
   })

   // Debounce solo el search para mejor UX
   const debouncedSearch = useDebounce(filters.search, debounceMs)

   // Actualizar un filtro específico
   const updateFilter = useCallback((key: keyof UnifiedWarehouseFilters, value: any) => {
      setFilters(prev => ({
         ...prev,
         [key]: value
      }))
   }, [])

   // Actualizar búsqueda (para SearchBar)
   const updateSearch = useCallback((searchTerm: string) => {
      const cleanSearch = searchTerm.trim() || undefined
      setFilters(prev => ({
         ...prev,
         search: cleanSearch
      }))
   }, [])

   // Limpiar filtros (mantener búsqueda)
   const clearFilters = useCallback(() => {
      setFilters(prev => ({
         ...defaultFilters,
         search: prev.search // Mantener búsqueda
      }))
   }, [])

   // Limpiar búsqueda (mantener filtros)
   const clearSearch = useCallback(() => {
      setFilters(prev => ({
         ...prev,
         search: undefined
      }))
   }, [])

   // Limpiar todo
   const clearAll = useCallback(() => {
      setFilters({ ...defaultFilters })
   }, [])

   // Verificar si hay filtros activos (sin contar búsqueda)
   const hasActiveFilters = useMemo(() => {
      return Boolean(
         filters.type ||
         filters.withDeleted ||
         filters.onlyDeleted ||
         (filters.sortBy && filters.sortBy !== 'createdAt') ||
         (filters.sortOrder && filters.sortOrder !== 'DESC')
      )
   }, [filters])

   // Verificar si hay búsqueda activa
   const hasActiveSearch = useMemo(() => {
      return Boolean(filters.search)
   }, [filters.search])

   // Convertir a formato para backend (con search debouncado)
   const getBackendFilters = useCallback((): WarehouseFilters => {
      // Limpiar valores vacíos y transformar valores especiales
      const cleanFilters: WarehouseFilters = {
         // Solo incluir search si hay un valor después del debounce
         ...(debouncedSearch ? { search: debouncedSearch } : {}),

         // Transformar type: si es 'all' o undefined, no incluirlo
         // Si es un WarehouseType válido, incluirlo
         ...(filters.type && filters.type !== 'all' ? {
            type: filters.type as WarehouseType // Safe cast porque ya verificamos que no es 'all'
         } : {}),

         // Incluir flags booleanos solo si son true
         ...(filters.withDeleted ? { withDeleted: true } : {}),
         ...(filters.onlyDeleted ? { onlyDeleted: true } : {}),

         // Paginación y límites
         ...(filters.page ? { page: filters.page } : {}),
         ...(filters.limit ? { limit: filters.limit } : {}),

         // Solo incluir ordenamiento si es diferente al default
         ...(filters.sortBy && filters.sortBy !== 'createdAt' ? { sortBy: filters.sortBy } : {}),
         ...(filters.sortOrder && filters.sortOrder !== 'DESC' ? { sortOrder: filters.sortOrder } : {})
      }

      return cleanFilters
   }, [debouncedSearch, filters])

   return {
      filters,
      updateFilter,
      updateSearch,
      clearFilters,
      clearSearch,
      clearAll,
      hasActiveFilters,
      hasActiveSearch,
      getBackendFilters
   }
}