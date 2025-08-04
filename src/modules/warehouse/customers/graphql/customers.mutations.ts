import { gql } from '@apollo/client';

/**
 * Mutation para crear un nuevo cliente
 */
export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      externalId
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation para actualizar un cliente
 */
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      externalId
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation para eliminar un cliente (soft delete)
 */
export const REMOVE_CUSTOMER = gql`
  mutation RemoveCustomer($id: Int!) {
    removeCustomer(id: $id)
  }
`;

/**
 * Mutation para restaurar un cliente eliminado
 */
export const RESTORE_CUSTOMER = gql`
  mutation RestoreCustomer($id: Int!) {
    restoreCustomer(id: $id)
  }
`;

/**
 * Mutation para eliminar permanentemente un cliente
 */
export const HARD_DELETE_CUSTOMER = gql`
  mutation HardDeleteCustomer($id: Int!) {
    hardDeleteCustomer(id: $id)
  }
`;