import { gql } from '@apollo/client'

// ===============================
// FRAGMENTOS REUTILIZABLES
// ===============================

export const WAREHOUSE_FRAGMENT = gql`
  fragment WarehouseFragment on Warehouse {
    id
    name
    description
    location
    type
    isActive
    createdAt
    updatedAt
    deletedAt
    createdById
    updatedById
    deletedById
    restoredById
    warehouseLocations {
      id
      name
      description
    }
  }
`

export const PAGINATION_META_FRAGMENT = gql`
  fragment PaginationMetaFragment on PaginationMeta {
    totalItems
    itemCount
    itemsPerPage
    totalPages
    currentPage
  }
`

// ===============================
// QUERIES PRINCIPALES
// ===============================

/**
 * Query para obtener warehouses paginados con filtros
 */
export const GET_WAREHOUSES = gql`
  ${WAREHOUSE_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetWarehouses($filters: WarehouseFiltersInput) {
    warehouses(filters: $filters) {
      items {
        ...WarehouseFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`

/**
 * Query para obtener un warehouse específico por ID
 */
export const GET_WAREHOUSE = gql`
  ${WAREHOUSE_FRAGMENT}
  query GetWarehouse($id: Int!) {
    warehouse(id: $id) {
      ...WarehouseFragment
    }
  }
`

/**
 * Query para obtener warehouses eliminados (soft deleted)
 */
export const GET_DELETED_WAREHOUSES = gql`
  ${WAREHOUSE_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetDeletedWarehouses($filters: WarehouseFiltersInput) {
    warehouses(filters: $filters) {
      items {
        ...WarehouseFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`

/**
 * Query para búsqueda rápida de warehouses (solo campos esenciales)
 */
export const SEARCH_WAREHOUSES = gql`
  query SearchWarehouses($filters: WarehouseFiltersInput) {
    warehouses(filters: $filters) {
      items {
        id
        name
        description
        location
        type
        isActive
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
  ${PAGINATION_META_FRAGMENT}
`

/**
 * Query para obtener warehouses por tipo específico
 */
export const GET_WAREHOUSES_BY_TYPE = gql`
  ${WAREHOUSE_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetWarehousesByType($type: WarehouseType!, $filters: WarehouseFiltersInput) {
    warehouses(filters: $filters) {
      items {
        ...WarehouseFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`