import { useMutation, ApolloError } from '@apollo/client'
import { useCallback } from 'react'
import {
   CREATE_WAREHOUSE,
   UPDATE_WAREHOUSE,
   REMOVE_WAREHOUSE,
   RESTORE_WAREHOUSE,
   HARD_DELETE_WAREHOUSE,
} from '../graphql/warehouse.mutations'
import { GET_WAREHOUSES } from '../graphql/warehouse.queries'
import type {
   Warehouse,
   CreateWarehouseInput,
   UpdateWarehouseInput,
   CreateWarehouseData,
   CreateWarehouseVars,
   UpdateWarehouseData,
   UpdateWarehouseVars,
   RemoveWarehouseData,
   RemoveWarehouseVars,
   RestoreWarehouseData,
   RestoreWarehouseVars,
   HardDeleteWarehouseData,
   HardDeleteWarehouseVars,
} from '../types/warehouse.types'

// ===============================
// RESULTADO COMÚN PARA MUTATIONS
// ===============================

interface BaseMutationResult {
   loading: boolean
   error?: ApolloError
   errorMessage?: string
}

// ===============================
// HOOK PRINCIPAL PARA MUTATIONS
// ===============================

interface UseWarehouseMutationsResult {
   // Crear warehouse
   createWarehouse: (input: CreateWarehouseInput) => Promise<Warehouse | undefined>
   createWarehouseResult: BaseMutationResult

   // Actualizar warehouse
   updateWarehouse: (input: UpdateWarehouseInput) => Promise<Warehouse | undefined>
   updateWarehouseResult: BaseMutationResult

   // Eliminar warehouse (soft delete)
   removeWarehouse: (id: number) => Promise<boolean>
   removeWarehouseResult: BaseMutationResult

   // Restaurar warehouse
   restoreWarehouse: (id: number) => Promise<boolean>
   restoreWarehouseResult: BaseMutationResult

   // Eliminar permanentemente
   hardDeleteWarehouse: (id: number) => Promise<boolean>
   hardDeleteWarehouseResult: BaseMutationResult

   // Estado global
   isAnyLoading: boolean
}

interface UseWarehouseMutationsOptions {
   onSuccess?: (action: string, data?: any) => void
   onError?: (action: string, error: ApolloError) => void
   updateCache?: boolean
}

export function useWarehouseMutations({
   onSuccess,
   onError,
   updateCache = true,
}: UseWarehouseMutationsOptions = {}): UseWarehouseMutationsResult {

   // ===============================
   // CONFIGURACIÓN DE MUTATIONS
   // ===============================

   const mutationOptions = {
      errorPolicy: 'all' as const,
      onCompleted: (data: any, action: string) => {
         onSuccess?.(action, data)
      },
      onError: (error: ApolloError, action: string) => {
         onError?.(action, error)
      },
   }

   // ===============================
   // MUTATION: CREAR WAREHOUSE
   // ===============================

   const [createWarehouseMutation, createWarehouseMutationResult] = useMutation<
      CreateWarehouseData,
      CreateWarehouseVars
   >(CREATE_WAREHOUSE, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, 'create'),
      onError: (error) => mutationOptions.onError(error, 'create'),
      refetchQueries: updateCache ? [{ query: GET_WAREHOUSES }] : undefined,
   })

   const createWarehouse = useCallback(
      async (input: CreateWarehouseInput): Promise<Warehouse | undefined> => {
         try {
            const result = await createWarehouseMutation({ variables: { input } })
            return result.data?.createWarehouse
         } catch (error) {
            console.error('Error creating warehouse:', error)
            return undefined
         }
      },
      [createWarehouseMutation]
   )

   // ===============================
   // MUTATION: ACTUALIZAR WAREHOUSE
   // ===============================

   const [updateWarehouseMutation, updateWarehouseMutationResult] = useMutation<
      UpdateWarehouseData,
      UpdateWarehouseVars
   >(UPDATE_WAREHOUSE, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, 'update'),
      onError: (error) => mutationOptions.onError(error, 'update'),
   })

   const updateWarehouse = useCallback(
      async (input: UpdateWarehouseInput): Promise<Warehouse | undefined> => {
         try {
            const result = await updateWarehouseMutation({ variables: { input } })
            return result.data?.updateWarehouse
         } catch (error) {
            console.error('Error updating warehouse:', error)
            return undefined
         }
      },
      [updateWarehouseMutation]
   )

   // ===============================
   // MUTATION: ELIMINAR WAREHOUSE (SOFT DELETE)
   // ===============================

   const [removeWarehouseMutation, removeWarehouseMutationResult] = useMutation<
      RemoveWarehouseData,
      RemoveWarehouseVars
   >(REMOVE_WAREHOUSE, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, 'remove'),
      onError: (error) => mutationOptions.onError(error, 'remove'),
      refetchQueries: updateCache ? [{ query: GET_WAREHOUSES }] : undefined,
   })

   const removeWarehouse = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await removeWarehouseMutation({
               variables: { id },
            })
            return result.data?.removeWarehouse ?? false
         } catch (error) {
            console.error('Error removing warehouse:', error)
            return false
         }
      },
      [removeWarehouseMutation]
   )

   // ===============================
   // MUTATION: RESTAURAR WAREHOUSE
   // ===============================

   const [restoreWarehouseMutation, restoreWarehouseMutationResult] = useMutation<
      RestoreWarehouseData,
      RestoreWarehouseVars
   >(RESTORE_WAREHOUSE, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, 'restore'),
      onError: (error) => mutationOptions.onError(error, 'restore'),
      refetchQueries: updateCache ? [{ query: GET_WAREHOUSES }] : undefined,
   })

   const restoreWarehouse = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await restoreWarehouseMutation({ variables: { id } })
            return result.data?.restoreWarehouse ?? false
         } catch (error) {
            console.error('Error restoring warehouse:', error)
            return false
         }
      },
      [restoreWarehouseMutation]
   )

   // ===============================
   // MUTATION: ELIMINAR PERMANENTEMENTE
   // ===============================

   const [hardDeleteWarehouseMutation, hardDeleteWarehouseMutationResult] = useMutation<
      HardDeleteWarehouseData,
      HardDeleteWarehouseVars
   >(HARD_DELETE_WAREHOUSE, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, 'hardDelete'),
      onError: (error) => mutationOptions.onError(error, 'hardDelete'),
      refetchQueries: updateCache ? [{ query: GET_WAREHOUSES }] : undefined,
   })

   const hardDeleteWarehouse = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await hardDeleteWarehouseMutation({
               variables: { id },
            })
            return result.data?.hardDeleteWarehouse ?? false
         } catch (error) {
            console.error('Error hard deleting warehouse:', error)
            return false
         }
      },
      [hardDeleteWarehouseMutation]
   )

   // ===============================
   // HELPERS PARA MENSAJES DE ERROR
   // ===============================

   const getErrorMessage = (error?: ApolloError): string | undefined => {
      if (!error) return undefined
      return error.graphQLErrors.map(e => e.message).join(' ') || error.message
   }

   // ===============================
   // ESTADO GLOBAL
   // ===============================

   const isAnyLoading = [
      createWarehouseMutationResult.loading,
      updateWarehouseMutationResult.loading,
      removeWarehouseMutationResult.loading,
      restoreWarehouseMutationResult.loading,
      hardDeleteWarehouseMutationResult.loading,
   ].some(Boolean)

   return {
      // Crear warehouse
      createWarehouse,
      createWarehouseResult: {
         loading: createWarehouseMutationResult.loading,
         error: createWarehouseMutationResult.error,
         errorMessage: getErrorMessage(createWarehouseMutationResult.error),
      },

      // Actualizar warehouse
      updateWarehouse,
      updateWarehouseResult: {
         loading: updateWarehouseMutationResult.loading,
         error: updateWarehouseMutationResult.error,
         errorMessage: getErrorMessage(updateWarehouseMutationResult.error),
      },

      // Eliminar warehouse (soft delete)
      removeWarehouse,
      removeWarehouseResult: {
         loading: removeWarehouseMutationResult.loading,
         error: removeWarehouseMutationResult.error,
         errorMessage: getErrorMessage(removeWarehouseMutationResult.error),
      },

      // Restaurar warehouse
      restoreWarehouse,
      restoreWarehouseResult: {
         loading: restoreWarehouseMutationResult.loading,
         error: restoreWarehouseMutationResult.error,
         errorMessage: getErrorMessage(restoreWarehouseMutationResult.error),
      },

      // Eliminar permanentemente
      hardDeleteWarehouse,
      hardDeleteWarehouseResult: {
         loading: hardDeleteWarehouseMutationResult.loading,
         error: hardDeleteWarehouseMutationResult.error,
         errorMessage: getErrorMessage(hardDeleteWarehouseMutationResult.error),
      },

      // Estado global
      isAnyLoading,
   }
}