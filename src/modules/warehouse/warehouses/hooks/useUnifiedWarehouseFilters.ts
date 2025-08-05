import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect } from 'react'
import type {
   UnifiedWarehouseFilters,
   WarehouseFilters,
   UseUnifiedWarehouseFiltersOptions,
   UseUnifiedWarehouseFiltersReturn,
   WarehouseType
} from '../types/warehouse.types'

// ===============================
// PERSISTENCIA DE FILTROS
// ===============================

const FILTERS_STORAGE_KEY = 'warehouse_filters_state';
const STORAGE_VERSION = '1.0';

interface StoredFilters {
   version: string;
   filters: UnifiedWarehouseFilters;
   timestamp: number;
}

const saveFiltersToStorage = (filters: UnifiedWarehouseFilters) => {
   try {
      const stored: StoredFilters = {
         version: STORAGE_VERSION,
         filters,
         timestamp: Date.now()
      };
      sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(stored));
   } catch (error) {
      console.warn('No se pudieron guardar los filtros:', error);
   }
};

const loadFiltersFromStorage = (): UnifiedWarehouseFilters | null => {
   try {
      const stored = sessionStorage.getItem(FILTERS_STORAGE_KEY);
      if (!stored) return null;

      const parsed: StoredFilters = JSON.parse(stored);
      
      // Verificar versión para compatibilidad
      if (parsed.version !== STORAGE_VERSION) {
         sessionStorage.removeItem(FILTERS_STORAGE_KEY);
         return null;
      }

      // Verificar que no sea muy antiguo (1 hora)
      const isExpired = Date.now() - parsed.timestamp > 60 * 60 * 1000;
      if (isExpired) {
         sessionStorage.removeItem(FILTERS_STORAGE_KEY);
         return null;
      }

      return parsed.filters;
   } catch (error) {
      console.warn('Error al cargar filtros del storage:', error);
      return null;
   }
};

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
   debounceMs = 500 // Aumentado para reducir consultas
}: UseUnifiedWarehouseFiltersOptions = {}): UseUnifiedWarehouseFiltersReturn {

   // Inicializar con filtros del storage si existen
   const [filters, setFilters] = useState<UnifiedWarehouseFilters>(() => {
      const storedFilters = loadFiltersFromStorage();
      return {
         ...defaultFilters,
         ...storedFilters,
         ...initialFilters // Los iniciales tienen prioridad
      };
   });

   // Debounce solo el search para mejor UX
   const debouncedSearch = useDebounce(filters.search, debounceMs)

   // Actualizar un filtro específico
   const updateFilter = useCallback((key: keyof UnifiedWarehouseFilters, value: any) => {
      setFilters(prev => ({
         ...prev,
         [key]: value
      }))
   }, [])

   // Persistir filtros cuando cambien (con debounce)
   const debouncedFilters = useDebounce(filters, 1000);
   useEffect(() => {
      saveFiltersToStorage(debouncedFilters);
   }, [debouncedFilters]);

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
      sessionStorage.removeItem(FILTERS_STORAGE_KEY);
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
      sessionStorage.removeItem(FILTERS_STORAGE_KEY);
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