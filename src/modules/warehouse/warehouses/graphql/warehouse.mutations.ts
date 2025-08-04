import { gql } from '@apollo/client';
import { WAREHOUSE_FRAGMENT } from './warehouse.queries';

// ===============================
// MUTATIONS PRINCIPALES
// ===============================

/**
 * Mutation para crear un nuevo warehouse
 */
export const CREATE_WAREHOUSE = gql`
  ${WAREHOUSE_FRAGMENT}
  mutation CreateWarehouse($input: CreateWarehouseInput!) {
    createWarehouse(input: $input) {
      ...WarehouseFragment
    }
  }
`;

/**
 * Mutation para actualizar un warehouse existente
 */
export const UPDATE_WAREHOUSE = gql`
  ${WAREHOUSE_FRAGMENT}
  mutation UpdateWarehouse($input: UpdateWarehouseInput!) {
    updateWarehouse(input: $input) {
      ...WarehouseFragment
    }
  }
`;

/**
 * Mutation para eliminar un warehouse (soft delete)
 */
export const REMOVE_WAREHOUSE = gql`
  mutation RemoveWarehouse($id: Int!) {
    removeWarehouse(id: $id)
  }
`;

/**
 * Mutation para restaurar un warehouse eliminado
 */
export const RESTORE_WAREHOUSE = gql`
  mutation RestoreWarehouse($id: Int!) {
    restoreWarehouse(id: $id)
  }
`;

/**
 * Mutation para eliminar permanentemente un warehouse
 */
export const HARD_DELETE_WAREHOUSE = gql`
  mutation HardDeleteWarehouse($id: Int!) {
    hardDeleteWarehouse(id: $id)
  }
`;

// ===============================
// MUTATIONS OPTIMIZADAS
// ===============================

/**
 * Mutation para crear warehouse con campos mínimos de retorno
 */
export const CREATE_WAREHOUSE_MINIMAL = gql`
  mutation CreateWarehouseMinimal($input: CreateWarehouseInput!) {
    createWarehouse(input: $input) {
      id
      name
      location
      type
      isActive
      createdAt
    }
  }
`;

/**
 * Mutation para actualizar solo campos específicos
 */
export const UPDATE_WAREHOUSE_PARTIAL = gql`
  mutation UpdateWarehousePartial($input: UpdateWarehouseInput!) {
    updateWarehouse(input: $input) {
      id
      name
      description
      location
      type
      isActive
      updatedAt
    }
  }
`;