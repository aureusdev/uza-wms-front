import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'sonner';
import {
   GET_CUSTOMERS,
   GET_CUSTOMER,
   GET_CUSTOMER_BY_EXTERNAL_ID
} from '../graphql/customers.queries';
import {
   CREATE_CUSTOMER,
   UPDATE_CUSTOMER,
   REMOVE_CUSTOMER,
   RESTORE_CUSTOMER,
   HARD_DELETE_CUSTOMER
} from '../graphql/customers.mutations';
import type {
   Customer,
   CreateCustomerInput,
   UpdateCustomerInput,
   FindCustomersDto,
   PaginatedCustomers
} from '../types/customer.types';

/**
 * Hook para obtener lista de clientes con filtros y paginación
 */
export function useCustomers(filters?: FindCustomersDto) {
   return useQuery<{ customers: PaginatedCustomers }>(GET_CUSTOMERS, {
      variables: { filters },
      errorPolicy: 'all',
   });
}

/**
 * Hook para obtener un cliente por ID
 */
export function useCustomer(id: number) {
   return useQuery<{ customer: Customer }>(GET_CUSTOMER, {
      variables: { id },
      skip: !id,
      errorPolicy: 'all',
   });
}

/**
 * Hook para obtener un cliente por ID externo
 */
export function useCustomerByExternalId(externalId: number) {
   return useQuery<{ customerByExternalId: Customer | null }>(GET_CUSTOMER_BY_EXTERNAL_ID, {
      variables: { externalId },
      skip: !externalId,
      errorPolicy: 'all',
   });
}

/**
 * Hook para operaciones de mutación de clientes
 */
export function useCustomerMutations() {
   const client = useApolloClient();

   const [createCustomerMutation, { loading: creating }] = useMutation(CREATE_CUSTOMER, {
      onCompleted: () => {
         toast.success('Cliente creado exitosamente');
         client.refetchQueries({ include: [GET_CUSTOMERS] });
      },
      onError: (error) => {
         toast.error(`Error al crear cliente: ${error.message}`);
      },
   });

   const [updateCustomerMutation, { loading: updating }] = useMutation(UPDATE_CUSTOMER, {
      onCompleted: () => {
         toast.success('Cliente actualizado exitosamente');
         client.refetchQueries({ include: [GET_CUSTOMERS, GET_CUSTOMER] });
      },
      onError: (error) => {
         toast.error(`Error al actualizar cliente: ${error.message}`);
      },
   });

   const [removeCustomerMutation, { loading: removing }] = useMutation(REMOVE_CUSTOMER, {
      onCompleted: () => {
         toast.success('Cliente eliminado exitosamente');
         client.refetchQueries({ include: [GET_CUSTOMERS] });
      },
      onError: (error) => {
         toast.error(`Error al eliminar cliente: ${error.message}`);
      },
   });

   const [restoreCustomerMutation, { loading: restoring }] = useMutation(RESTORE_CUSTOMER, {
      onCompleted: () => {
         toast.success('Cliente restaurado exitosamente');
         client.refetchQueries({ include: [GET_CUSTOMERS] });
      },
      onError: (error) => {
         toast.error(`Error al restaurar cliente: ${error.message}`);
      },
   });

   const [hardDeleteCustomerMutation, { loading: hardDeleting }] = useMutation(HARD_DELETE_CUSTOMER, {
      onCompleted: () => {
         toast.success('Cliente eliminado permanentemente');
         client.refetchQueries({ include: [GET_CUSTOMERS] });
      },
      onError: (error) => {
         toast.error(`Error al eliminar permanentemente: ${error.message}`);
      },
   });

   const createCustomer = async (input: CreateCustomerInput) => {
      return createCustomerMutation({ variables: { input } });
   };

   const updateCustomer = async (input: UpdateCustomerInput) => {
      return updateCustomerMutation({ variables: { input } });
   };

   const removeCustomer = async (id: number) => {
      return removeCustomerMutation({ variables: { id } });
   };

   const restoreCustomer = async (id: number) => {
      return restoreCustomerMutation({ variables: { id } });
   };

   const hardDeleteCustomer = async (id: number) => {
      return hardDeleteCustomerMutation({ variables: { id } });
   };

   return {
      createCustomer,
      updateCustomer,
      removeCustomer,
      restoreCustomer,
      hardDeleteCustomer,
      loading: creating || updating || removing || restoring || hardDeleting,
   };
}