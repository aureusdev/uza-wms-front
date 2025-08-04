import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type {
   UnifiedContainerFilters,
   ContainerFilters,
   UseUnifiedContainerFiltersOptions,
   UseUnifiedContainerFiltersReturn
} from '../types/container.types'

const defaultFilters: UnifiedContainerFilters = {
   search: undefined,
   status: undefined,
   withDeleted: false,
   onlyDeleted: false,
   sortBy: 'createdAt',
   sortOrder: 'DESC'
}

export function useUnifiedContainerFilters({
   initialFilters = {},
   debounceMs = 300
}: UseUnifiedContainerFiltersOptions = {}): UseUnifiedContainerFiltersReturn {

   const [filters, setFilters] = useState<UnifiedContainerFilters>({
      ...defaultFilters,
      ...initialFilters
   })

   // Debounce solo el search para mejor UX
   const debouncedSearch = useDebounce(filters.search, debounceMs)

   // Actualizar un filtro específico
   const updateFilter = useCallback((key: keyof UnifiedContainerFilters, value: any) => {
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
         filters.status ||
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
   const getBackendFilters = useCallback((): ContainerFilters => {
      return {
         search: debouncedSearch,
         status: filters.status,
         withDeleted: filters.withDeleted,
         onlyDeleted: filters.onlyDeleted,
         sortBy: filters.sortBy,
         sortOrder: filters.sortOrder
      }
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