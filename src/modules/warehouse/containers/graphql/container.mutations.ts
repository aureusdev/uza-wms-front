import { gql } from '@apollo/client';
import { CONTAINER_FRAGMENT } from './container.queries';

// ===============================
// MUTATIONS PRINCIPALES
// ===============================

/**
 * Mutation para crear un nuevo contenedor
 */
export const CREATE_CONTAINER = gql`
  ${CONTAINER_FRAGMENT}
  mutation CreateContainer($input: CreateContainerInput!) {
    createContainer(input: $input) {
      ...ContainerFragment
    }
  }
`;

/**
 * Mutation para actualizar un contenedor existente
 */
export const UPDATE_CONTAINER = gql`
  ${CONTAINER_FRAGMENT}
  mutation UpdateContainer($input: UpdateContainerInput!) {
    updateContainer(input: $input) {
      ...ContainerFragment
    }
  }
`;

/**
 * Mutation para eliminar un contenedor (soft delete)
 */
export const REMOVE_CONTAINER = gql`
  mutation RemoveContainer($id: Int!) {
    removeContainer(id: $id)
  }
`;

/**
 * Mutation para restaurar un contenedor eliminado
 */
export const RESTORE_CONTAINER = gql`
  mutation RestoreContainer($id: Int!) {
    restoreContainer(id: $id)
  }
`;

/**
 * Mutation para eliminar permanentemente un contenedor
 */
export const HARD_DELETE_CONTAINER = gql`
  mutation HardDeleteContainer($id: Int!) {
    hardDeleteContainer(id: $id)
  }
`;

// ===============================
// MUTATIONS OPTIMIZADAS
// ===============================

/**
 * Mutation para crear contenedor con campos mínimos de retorno
 */
export const CREATE_CONTAINER_MINIMAL = gql`
  mutation CreateContainerMinimal($input: CreateContainerInput!) {
    createContainer(input: $input) {
      id
      code
      name
      status
      createdAt
    }
  }
`;

/**
 * Mutation para actualizar solo campos específicos
 */
export const UPDATE_CONTAINER_PARTIAL = gql`
  mutation UpdateContainerPartial($input: UpdateContainerInput!) {
    updateContainer(input: $input) {
      id
      code
      name
      description
      status
      updatedAt
    }
  }
`;