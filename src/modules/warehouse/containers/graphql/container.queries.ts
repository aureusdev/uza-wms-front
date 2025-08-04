import { gql } from '@apollo/client';

// ===============================
// FRAGMENTOS REUTILIZABLES
// ===============================

export const CONTAINER_FRAGMENT = gql`
  fragment ContainerFragment on Container {
    id
    code
    name
    description
    status
    createdAt
    updatedAt
    deletedAt
    createdById
    updatedById
    deletedById
    restoredById
    inventoryItems {
      id
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
 * Query para obtener contenedores paginados con filtros
 */
export const GET_CONTAINERS = gql`
  ${CONTAINER_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetContainers($filters: ContainerFiltersInput) {
    containers(filters: $filters) {
      items {
        ...ContainerFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;

/**
 * Query para obtener un contenedor específico por ID
 */
export const GET_CONTAINER = gql`
  ${CONTAINER_FRAGMENT}
  query GetContainer($id: Int!) {
    container(id: $id) {
      ...ContainerFragment
    }
  }
`;

/**
 * Query para obtener contenedores eliminados (soft deleted)
 */
export const GET_DELETED_CONTAINERS = gql`
  ${CONTAINER_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetDeletedContainers($filters: ContainerFiltersInput) {
    containers(filters: $filters) {
      items {
        ...ContainerFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;

/**
 * Query para búsqueda rápida de contenedores (solo campos esenciales)
 */
export const SEARCH_CONTAINERS = gql`
  query SearchContainers($filters: ContainerFiltersInput) {
    containers(filters: $filters) {
      items {
        id
        code
        name
        description
        status
        inventoryItems {
          id
          # Eliminamos los campos que no existen en el modelo InventoryItem
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
 * Query para obtener contenedores por estado
 */
export const GET_CONTAINERS_BY_STATUS = gql`
  ${CONTAINER_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetContainersByStatus($status: String!, $filters: ContainerFiltersInput) {
    containers(filters: $filters) {
      items {
        ...ContainerFragment
      }
      meta {
        ...PaginationMetaFragment
      }
    }
  }
`;