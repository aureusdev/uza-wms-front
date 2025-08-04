import { useMutation, ApolloError } from "@apollo/client";
import { useCallback } from "react";
import {
   CREATE_ITEM,
   UPDATE_ITEM,
   REMOVE_ITEM,
   RESTORE_ITEM,
   HARD_DELETE_ITEM,
} from "../graphql/item.mutations";
import { GET_ITEMS } from "../graphql/item.queries";
import type {
   Item,
   CreateItemInput,
   UpdateItemInput,
   CreateItemData,
   CreateItemVars,
   UpdateItemData,
   UpdateItemVars,
   RemoveItemData,
   RemoveItemVars,
   RestoreItemData,
   RestoreItemVars,
   HardDeleteItemData,
   HardDeleteItemVars,
} from "../types/item.types";

// ===============================
// RESULTADO COMÚN PARA MUTATIONS
// ===============================

interface BaseMutationResult {
   loading: boolean;
   error?: ApolloError;
   errorMessage?: string;
}

// ===============================
// HOOK PRINCIPAL PARA MUTATIONS
// ===============================

interface UseItemMutationsResult {
   // Crear item
   createItem: (input: CreateItemInput) => Promise<Item | undefined>;
   createItemResult: BaseMutationResult;

   // Actualizar item
   updateItem: (input: UpdateItemInput) => Promise<Item | undefined>;
   updateItemResult: BaseMutationResult;

   // Eliminar item (soft delete)
   removeItem: (id: number) => Promise<boolean>;
   removeItemResult: BaseMutationResult;

   // Restaurar item
   restoreItem: (id: number) => Promise<boolean>;
   restoreItemResult: BaseMutationResult;

   // Eliminar permanentemente
   hardDeleteItem: (id: number) => Promise<boolean>;
   hardDeleteItemResult: BaseMutationResult;

   // Estado global
   isAnyLoading: boolean;
}

interface UseItemMutationsOptions {
   onSuccess?: (action: string, data?: any) => void;
   onError?: (action: string, error: ApolloError) => void;
   updateCache?: boolean;
}

export function useItemMutations({
   onSuccess,
   onError,
   updateCache = true,
}: UseItemMutationsOptions = {}): UseItemMutationsResult {

   // ===============================
   // CONFIGURACIÓN DE MUTATIONS
   // ===============================

   const mutationOptions = {
      errorPolicy: "all" as const,
      onCompleted: (data: any, action: string) => {
         onSuccess?.(action, data);
      },
      onError: (error: ApolloError, action: string) => {
         onError?.(action, error);
      },
   };

   // ===============================
   // MUTATION: CREAR ITEM
   // ===============================

   const [createItemMutation, createItemMutationResult] = useMutation<
      CreateItemData,
      CreateItemVars
   >(CREATE_ITEM, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "create"),
      onError: (error) => mutationOptions.onError(error, "create"),
      refetchQueries: updateCache ? [{ query: GET_ITEMS }] : undefined,
   });

   const createItem = useCallback(
      async (input: CreateItemInput): Promise<Item | undefined> => {
         try {
            const result = await createItemMutation({ variables: { input } });
            return result.data?.createItem;
         } catch (error) {
            console.error("Error creating item:", error);
            return undefined;
         }
      },
      [createItemMutation]
   );

   // ===============================
   // MUTATION: ACTUALIZAR ITEM
   // ===============================

   const [updateItemMutation, updateItemMutationResult] = useMutation<
      UpdateItemData,
      UpdateItemVars
   >(UPDATE_ITEM, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "update"),
      onError: (error) => mutationOptions.onError(error, "update"),
   });

   const updateItem = useCallback(
      async (input: UpdateItemInput): Promise<Item | undefined> => {
         try {
            const result = await updateItemMutation({ variables: { input } });
            return result.data?.updateItem;
         } catch (error) {
            console.error("Error updating item:", error);
            return undefined;
         }
      },
      [updateItemMutation]
   );

   // ===============================
   // MUTATION: ELIMINAR ITEM (SOFT DELETE)
   // ===============================

   const [removeItemMutation, removeItemMutationResult] = useMutation<
      RemoveItemData,
      RemoveItemVars
   >(REMOVE_ITEM, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "remove"),
      onError: (error) => mutationOptions.onError(error, "remove"),
      refetchQueries: updateCache ? [{ query: GET_ITEMS }] : undefined,
   });

   const removeItem = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await removeItemMutation({
               variables: { id },
            });
            return result.data?.removeItem ?? false;
         } catch (error) {
            console.error("Error removing item:", error);
            return false;
         }
      },
      [removeItemMutation]
   );

   // ===============================
   // MUTATION: RESTAURAR ITEM
   // ===============================

   const [restoreItemMutation, restoreItemMutationResult] = useMutation<
      RestoreItemData,
      RestoreItemVars
   >(RESTORE_ITEM, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "restore"),
      onError: (error) => mutationOptions.onError(error, "restore"),
      refetchQueries: updateCache ? [{ query: GET_ITEMS }] : undefined,
   });

   const restoreItem = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await restoreItemMutation({ variables: { id } });
            return result.data?.restoreItem ?? false;
         } catch (error) {
            console.error("Error restoring item:", error);
            return false;
         }
      },
      [restoreItemMutation]
   );

   // ===============================
   // MUTATION: ELIMINAR PERMANENTEMENTE
   // ===============================

   const [hardDeleteItemMutation, hardDeleteItemMutationResult] = useMutation<
      HardDeleteItemData,
      HardDeleteItemVars
   >(HARD_DELETE_ITEM, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "hardDelete"),
      onError: (error) => mutationOptions.onError(error, "hardDelete"),
      refetchQueries: updateCache ? [{ query: GET_ITEMS }] : undefined,
   });

   const hardDeleteItem = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await hardDeleteItemMutation({
               variables: { id },
            });
            return result.data?.hardDeleteItem ?? false;
         } catch (error) {
            console.error("Error hard deleting item:", error);
            return false;
         }
      },
      [hardDeleteItemMutation]
   );

   // ===============================
   // HELPERS PARA MENSAJES DE ERROR
   // ===============================

   const getErrorMessage = (error?: ApolloError): string | undefined => {
      if (!error) return undefined;
      return error.graphQLErrors.map(e => e.message).join("; ") || error.message;
   };

   // ===============================
   // ESTADO GLOBAL
   // ===============================

   const isAnyLoading = [
      createItemMutationResult.loading,
      updateItemMutationResult.loading,
      removeItemMutationResult.loading,
      restoreItemMutationResult.loading,
      hardDeleteItemMutationResult.loading,
   ].some(Boolean);

   return {
      // Crear item
      createItem,
      createItemResult: {
         loading: createItemMutationResult.loading,
         error: createItemMutationResult.error,
         errorMessage: getErrorMessage(createItemMutationResult.error),
      },

      // Actualizar item
      updateItem,
      updateItemResult: {
         loading: updateItemMutationResult.loading,
         error: updateItemMutationResult.error,
         errorMessage: getErrorMessage(updateItemMutationResult.error),
      },

      // Eliminar item (soft delete)
      removeItem,
      removeItemResult: {
         loading: removeItemMutationResult.loading,
         error: removeItemMutationResult.error,
         errorMessage: getErrorMessage(removeItemMutationResult.error),
      },

      // Restaurar item
      restoreItem,
      restoreItemResult: {
         loading: restoreItemMutationResult.loading,
         error: restoreItemMutationResult.error,
         errorMessage: getErrorMessage(restoreItemMutationResult.error),
      },

      // Eliminar permanentemente
      hardDeleteItem,
      hardDeleteItemResult: {
         loading: hardDeleteItemMutationResult.loading,
         error: hardDeleteItemMutationResult.error,
         errorMessage: getErrorMessage(hardDeleteItemMutationResult.error),
      },

      // Estado global
      isAnyLoading,
   };
}