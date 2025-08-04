// ===============================
// ENTIDADES PRINCIPALES
// ===============================

export interface Item {
   id: number;
   code: string;
   name: string;
   brand?: string;
   price: number;
   tax: number;
   description?: string;
   specificDetails?: string;
   imageUrl?: string;
   itemCategory?: ItemCategory;
   createdAt: string;
   updatedAt: string;
   deletedAt?: string;
   createdById: number;
   updatedById: number;
   deletedById?: number;
   restoredById?: number;
}

export interface ItemCategory {
   id: number;
   name: string;
   description?: string;
   items?: Item[];
   createdAt: string;
   updatedAt: string;
}

// ===============================
// INPUTS PARA OPERACIONES
// ===============================

export interface CreateItemInput {
   code: string;
   name: string;
   brand?: string;
   price: number;
   tax?: number;
   description?: string;
   specificDetails?: string;
   imageUrl?: string;
   itemCategoryId?: number;
}

export interface UpdateItemInput {
   id: number;
   code?: string;
   name?: string;
   brand?: string;
   price?: number;
   tax?: number;
   description?: string;
   specificDetails?: string;
   imageUrl?: string;
   itemCategoryId?: number;
}

export interface ItemFilters {
   search?: string;
   minPrice?: number;
   maxPrice?: number;
   itemCategoryId?: number;
   withDeleted?: boolean;
   onlyDeleted?: boolean;
   page?: number;
   limit?: number;
   sortBy?: 'createdAt' | 'updatedAt' | 'code' | 'name' | 'brand' | 'price';
   sortOrder?: 'ASC' | 'DESC';
}

// ===============================
// FILTROS UNIFICADOS
// ===============================

export interface UnifiedItemFilters extends ItemFilters {
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

export interface PaginatedItems {
   items: Item[];
   meta: PaginationMeta;
}

// ===============================
// VARIABLES PARA QUERIES/MUTATIONS
// ===============================

export interface GetItemsVars {
   filters?: ItemFilters;
}

export interface GetItemsData {
   items: PaginatedItems;
}

export interface GetItemVars {
   id: number;
}

export interface GetItemData {
   item: Item;
}

export interface CreateItemVars {
   input: CreateItemInput;
}

export interface CreateItemData {
   createItem: Item;
}

export interface UpdateItemVars {
   input: UpdateItemInput;
}

export interface UpdateItemData {
   updateItem: Item;
}

export interface RemoveItemVars {
   id: number;
}

export interface RemoveItemData {
   removeItem: boolean;
}

export interface RestoreItemVars {
   id: number;
}

export interface RestoreItemData {
   restoreItem: boolean;
}

export interface HardDeleteItemVars {
   id: number;
}

export interface HardDeleteItemData {
   hardDeleteItem: boolean;
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

export interface ItemFormData extends Omit<CreateItemInput, 'tax'> {
   tax: number;
}

// ===============================
// TIPOS PARA HOOK UNIFICADO
// ===============================

export interface UseUnifiedItemFiltersOptions {
   initialFilters?: Partial<UnifiedItemFilters>;
   debounceMs?: number;
}

export interface UseUnifiedItemFiltersReturn {
   filters: UnifiedItemFilters;
   updateFilter: (key: keyof UnifiedItemFilters, value: any) => void;
   updateSearch: (searchTerm: string) => void;
   clearFilters: () => void;
   clearSearch: () => void;
   clearAll: () => void;
   hasActiveFilters: boolean;
   hasActiveSearch: boolean;
   getBackendFilters: () => ItemFilters;
}