export interface ItemCategory {
  id: number;
  name: string;
  description?: string;
  items?: {
    id: number;
    name: string;
    code: string;
  }[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateItemCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateItemCategoryInput {
  id: number;
  name?: string;
  description?: string;
}

export interface ItemCategoryFiltersInput {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
  withDeleted?: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedItemCategories {
  items: ItemCategory[];
  meta: PaginationMeta;
}