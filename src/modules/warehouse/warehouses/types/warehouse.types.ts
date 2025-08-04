// ===============================
// ENUMS
// ===============================

export enum WarehouseType {
   MAIN = 'MAIN',
   AUXILIARY = 'AUXILIAR',
   SITE = 'SITE'
}

// ===============================
// ENTIDADES PRINCIPALES
// ===============================

export interface Warehouse {
   id: number;
   name: string;
   description?: string;
   location: string;
   type: WarehouseType;
   isActive: boolean;
   warehouseLocations?: WarehouseLocation[];
   createdAt: string;
   updatedAt: string;
   deletedAt?: string;
   createdById: number;
   updatedById: number;
   deletedById?: number;
   restoredById?: number;
}

export interface WarehouseLocation {
   id: number;
   name: string;
   description?: string;
   warehouseId: number;
   warehouse?: Warehouse;
   createdAt: string;
   updatedAt: string;
}

// ===============================
// INPUTS PARA OPERACIONES
// ===============================

export interface CreateWarehouseInput {
   name: string;
   description?: string;
   location: string;
   type: WarehouseType;
}

export interface UpdateWarehouseInput {
   id: number;
   name?: string;
   description?: string;
   location?: string;
   type?: WarehouseType;
}

// Tipo base para los filtros que se envían al backend
export interface WarehouseFilters {
   search?: string;
   type?: WarehouseType;
   withDeleted?: boolean;
   onlyDeleted?: boolean;
   page?: number;
   limit?: number;
   sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'type';
   sortOrder?: 'ASC' | 'DESC';
}

// ===============================
// FILTROS UNIFICADOS
// ===============================

// Tipo especial para incluir 'all' como opción en el select de tipo
export type WarehouseTypeWithAll = WarehouseType | 'all'

// Filtros unificados para el frontend (con opción 'all' y flags de estado)
export interface UnifiedWarehouseFilters {
   search?: string;
   type?: WarehouseTypeWithAll; // Permite 'all' como opción
   withDeleted?: boolean;
   onlyDeleted?: boolean;
   page?: number;
   limit?: number;
   sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'type';
   sortOrder?: 'ASC' | 'DESC';
   hasActiveFilters?: boolean;
   hasActiveSearch?: boolean;
}

// ===============================
// RESPUESTAS DE GRAPHQL
// ===============================

export interface PaginationMeta {
   totalItems: number;
   itemCount: number;
   itemsPerPage: number;
   totalPages: number;
   currentPage: number;
}

export interface PaginatedWarehouses {
   items: Warehouse[];
   meta: PaginationMeta;
}

// ===============================
// VARIABLES PARA QUERIES/MUTATIONS
// ===============================

export interface GetWarehousesVars {
   filters?: WarehouseFilters;
}

export interface GetWarehousesData {
   warehouses: PaginatedWarehouses;
}

export interface GetWarehouseVars {
   id: number;
}

export interface GetWarehouseData {
   warehouse: Warehouse;
}

export interface CreateWarehouseVars {
   input: CreateWarehouseInput;
}

export interface CreateWarehouseData {
   createWarehouse: Warehouse;
}

export interface UpdateWarehouseVars {
   input: UpdateWarehouseInput;
}

export interface UpdateWarehouseData {
   updateWarehouse: Warehouse;
}

export interface RemoveWarehouseVars {
   id: number;
}

export interface RemoveWarehouseData {
   removeWarehouse: boolean;
}

export interface RestoreWarehouseVars {
   id: number;
}

export interface RestoreWarehouseData {
   restoreWarehouse: boolean;
}

export interface HardDeleteWarehouseVars {
   id: number;
}

export interface HardDeleteWarehouseData {
   hardDeleteWarehouse: boolean;
}

// ===============================
// UTILIDADES PARA HOOKS
// ===============================

export interface PaginationInfo {
   total: number;
   page: number;
   totalPages: number;
   limit: number;
   itemCount: number;
}

export interface WarehouseFormData extends CreateWarehouseInput { }

// ===============================
// TIPOS PARA HOOK UNIFICADO
// ===============================

export interface UseUnifiedWarehouseFiltersOptions {
   initialFilters?: Partial<UnifiedWarehouseFilters>;
   debounceMs?: number;
}

export interface UseUnifiedWarehouseFiltersReturn {
   filters: UnifiedWarehouseFilters;
   updateFilter: (key: keyof UnifiedWarehouseFilters, value: any) => void;
   updateSearch: (searchTerm: string) => void;
   clearFilters: () => void;
   clearSearch: () => void;
   clearAll: () => void;
   hasActiveFilters: boolean;
   hasActiveSearch: boolean;
   getBackendFilters: () => WarehouseFilters;
}