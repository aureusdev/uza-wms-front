import { gql } from '@apollo/client';

/**
 * Query para obtener todos los clientes con filtros y paginación
 */
export const GET_CUSTOMERS = gql`
  query GetCustomers($filters: FindCustomersDto) {
    customers(filters: $filters) {
      items {
        id
        externalId
        firstName
        lastName
        createdAt
        updatedAt
        deletedAt
      }
      meta {
        totalItems
        itemCount
        itemsPerPage
        totalPages
        currentPage
      }
    }
  }
`;

/**
 * Query para obtener un cliente por ID
 */
export const GET_CUSTOMER = gql`
  query GetCustomer($id: Int!) {
    customer(id: $id) {
      id
      externalId
      firstName
      lastName
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

/**
 * Query para obtener un cliente por ID externo
 */
export const GET_CUSTOMER_BY_EXTERNAL_ID = gql`
  query GetCustomerByExternalId($externalId: Int!) {
    customerByExternalId(externalId: $externalId) {
      id
      externalId
      firstName
      lastName
      createdAt
      updatedAt
      deletedAt
    }
  }
`;