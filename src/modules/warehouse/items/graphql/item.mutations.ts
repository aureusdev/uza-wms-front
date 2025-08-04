import { gql } from '@apollo/client';
import { ITEM_FRAGMENT } from './item.queries';

// ===============================
// MUTATIONS PRINCIPALES
// ===============================

/**
 * Mutation para crear un nuevo item
 */
export const CREATE_ITEM = gql`
  ${ITEM_FRAGMENT}
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      ...ItemFragment
    }
  }
`;

/**
 * Mutation para actualizar un item existente
 */
export const UPDATE_ITEM = gql`
  ${ITEM_FRAGMENT}
  mutation UpdateItem($input: UpdateItemInput!) {
    updateItem(input: $input) {
      ...ItemFragment
    }
  }
`;

/**
 * Mutation para eliminar un item (soft delete)
 */
export const REMOVE_ITEM = gql`
  mutation RemoveItem($id: Int!) {
    removeItem(id: $id)
  }
`;

/**
 * Mutation para restaurar un item eliminado
 */
export const RESTORE_ITEM = gql`
  mutation RestoreItem($id: Int!) {
    restoreItem(id: $id)
  }
`;

/**
 * Mutation para eliminar permanentemente un item
 */
export const HARD_DELETE_ITEM = gql`
  mutation HardDeleteItem($id: Int!) {
    hardDeleteItem(id: $id)
  }
`;

// ===============================
// MUTATIONS OPTIMIZADAS
// ===============================

/**
 * Mutation para crear item con campos mínimos de retorno
 */
export const CREATE_ITEM_MINIMAL = gql`
  mutation CreateItemMinimal($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      code
      name
      price
      createdAt
    }
  }
`;

/**
 * Mutation para actualizar solo campos específicos
 */
export const UPDATE_ITEM_PARTIAL = gql`
  mutation UpdateItemPartial($input: UpdateItemInput!) {
    updateItem(input: $input) {
      id
      code
      name
      brand
      price
      tax
      updatedAt
      itemCategory {
        id
        name
      }
    }
  }
`;