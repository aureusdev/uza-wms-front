// ===============================
// ENUMS
// ===============================

export enum ContainerStatus {
   AVAILABLE = 'DISPONIBLE',
   INACTIVE = 'INACTIVO',
   IN_REVIEW = 'EN REVISIÓN',
   ASSIGNED = 'ASIGNADO'
}

// ===============================
// ENTIDADES PRINCIPALES
// ===============================

export interface Container {
   id: number;
   code: string;
   name: string;
   description?: string;
   status: ContainerStatus;
   inventoryItems?: InventoryItem[];
   createdAt: string;
   updatedAt: string;
   deletedAt?: string;
   createdById: number;
   updatedById: number;
   deletedById?: number;
   restoredById?: number;
}

export interface InventoryItem {
   id: number;
   code: string;
   name: string;
}

// ===============================
// INPUTS PARA OPERACIONES
// ===============================

export interface CreateContainerInput {
   code: string;
   name: string;
   description?: string;
   status?: ContainerStatus;
}

export interface UpdateContainerInput {
   id: number;
   code?: string;
   name?: string;
   description?: string;
   status?: ContainerStatus;
}

export interface ContainerFilters {
   search?: string;
   status?: ContainerStatus;
   withDeleted?: boolean;
   onlyDeleted?: boolean;
   page?: number;
   limit?: number;
   sortBy?: 'createdAt' | 'updatedAt' | 'code' | 'name' | 'status';
   sortOrder?: 'ASC' | 'DESC';
}

// ===============================
// FILTROS UNIFICADOS
// ===============================

export interface UnifiedContainerFilters extends ContainerFilters {
   // Búsqueda principal (desde SearchBar)
   mainSearch?: string;
   // Indicadores de estado
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

export interface PaginatedContainers {
   items: Container[];
   meta: PaginationMeta;
}

// ===============================
// VARIABLES PARA QUERIES/MUTATIONS
// ===============================

export interface GetContainersVars {
   filters?: ContainerFilters;
}

export interface GetContainersData {
   containers: PaginatedContainers;
}

export interface GetContainerVars {
   id: number;
}

export interface GetContainerData {
   container: Container;
}

export interface CreateContainerVars {
   input: CreateContainerInput;
}

export interface CreateContainerData {
   createContainer: Container;
}

export interface UpdateContainerVars {
   input: UpdateContainerInput;
}

export interface UpdateContainerData {
   updateContainer: Container;
}

export interface RemoveContainerVars {
   id: number;
}

export interface RemoveContainerData {
   removeContainer: boolean;
}

export interface RestoreContainerVars {
   id: number;
}

export interface RestoreContainerData {
   restoreContainer: boolean;
}

export interface HardDeleteContainerVars {
   id: number;
}

export interface HardDeleteContainerData {
   hardDeleteContainer: boolean;
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

export interface ContainerFormData extends CreateContainerInput {
   status: ContainerStatus;
}

// ===============================
// TIPOS PARA HOOK UNIFICADO
// ===============================

export interface UseUnifiedContainerFiltersOptions {
   initialFilters?: Partial<UnifiedContainerFilters>;
   debounceMs?: number;
}

export interface UseUnifiedContainerFiltersReturn {
   filters: UnifiedContainerFilters;
   updateFilter: (key: keyof UnifiedContainerFilters, value: any) => void;
   updateSearch: (searchTerm: string) => void;
   clearFilters: () => void;
   clearSearch: () => void;
   clearAll: () => void;
   hasActiveFilters: boolean;
   hasActiveSearch: boolean;
   getBackendFilters: () => ContainerFilters;
}