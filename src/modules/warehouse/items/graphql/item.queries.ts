import { gql } from '@apollo/client';

// ===============================
// FRAGMENTOS REUTILIZABLES
// ===============================

export const ITEM_FRAGMENT = gql`
  fragment ItemFragment on Item {
    id
    code
    name
    brand
    price
    tax
    description
    specificDetails
    imageUrl
    createdAt
    updatedAt
    deletedAt
    createdById
    updatedById
    deletedById
    restoredById
    itemCategory {
      id
      name
      description
    }
  }
`;

export const PAGINATION_META_FRAGMENT = gql`
  fragment PaginationMetaFragment on PaginationMeta {
    totalItems
    itemCount
    itemsPerPage
    totalPages
    currentPage
  }
`;

// ===============================
// QUERIES PRINCIPALES
// ===============================

/**
 * Query para obtener items paginados con filtros
 */
export const GET_ITEMS = gql`
  ${ITEM_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetItems($filters: ItemFiltersInput) {
    items(filters: $filters) {
      items {
        ...ItemFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;

/**
 * Query para obtener un item específico por ID
 */
export const GET_ITEM = gql`
  ${ITEM_FRAGMENT}
  query GetItem($id: Int!) {
    item(id: $id) {
      ...ItemFragment
    }
  }
`;

/**
 * Query para obtener items eliminados (soft deleted)
 */
export const GET_DELETED_ITEMS = gql`
  ${ITEM_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetDeletedItems($filters: ItemFiltersInput) {
    items(filters: $filters) {
      items {
        ...ItemFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;

/**
 * Query para búsqueda rápida de items (solo campos esenciales)
 */
export const SEARCH_ITEMS = gql`
  query SearchItems($filters: ItemFiltersInput) {
    items(filters: $filters) {
      items {
        id
        code
        name
        brand
        price
        imageUrl
        itemCategory {
          id
          name
        }
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
  ${PAGINATION_META_FRAGMENT}
`;

/**
 * Query para obtener items de una categoría específica
 */
export const GET_ITEMS_BY_CATEGORY = gql`
  ${ITEM_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetItemsByCategory($categoryId: Int!, $filters: ItemFiltersInput) {
    items(filters: $filters) {
      items {
        ...ItemFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;