import { useMutation, ApolloError } from "@apollo/client";
import { useCallback } from "react";
import {
   CREATE_CONTAINER,
   UPDATE_CONTAINER,
   REMOVE_CONTAINER,
   RESTORE_CONTAINER,
   HARD_DELETE_CONTAINER,
} from "../graphql/container.mutations";
import { GET_CONTAINERS } from "../graphql/container.queries";
import type {
   Container,
   CreateContainerInput,
   UpdateContainerInput,
   CreateContainerData,
   CreateContainerVars,
   UpdateContainerData,
   UpdateContainerVars,
   RemoveContainerData,
   RemoveContainerVars,
   RestoreContainerData,
   RestoreContainerVars,
   HardDeleteContainerData,
   HardDeleteContainerVars,
} from "../types/container.types";

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

interface UseContainerMutationsResult {
   // Crear contenedor
   createContainer: (input: CreateContainerInput) => Promise<Container | undefined>;
   createContainerResult: BaseMutationResult;

   // Actualizar contenedor
   updateContainer: (input: UpdateContainerInput) => Promise<Container | undefined>;
   updateContainerResult: BaseMutationResult;

   // Eliminar contenedor (soft delete)
   removeContainer: (id: number) => Promise<boolean>;
   removeContainerResult: BaseMutationResult;

   // Restaurar contenedor
   restoreContainer: (id: number) => Promise<boolean>;
   restoreContainerResult: BaseMutationResult;

   // Eliminar permanentemente
   hardDeleteContainer: (id: number) => Promise<boolean>;
   hardDeleteContainerResult: BaseMutationResult;

   // Estado global
   isAnyLoading: boolean;
}

interface UseContainerMutationsOptions {
   onSuccess?: (action: string, data?: any) => void;
   onError?: (action: string, error: ApolloError) => void;
   updateCache?: boolean;
}

export function useContainerMutations({
   onSuccess,
   onError,
   updateCache = true,
}: UseContainerMutationsOptions = {}): UseContainerMutationsResult {

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
   // MUTATION: CREAR CONTENEDOR
   // ===============================

   const [createContainerMutation, createContainerMutationResult] = useMutation<
      CreateContainerData,
      CreateContainerVars
   >(CREATE_CONTAINER, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "create"),
      onError: (error) => mutationOptions.onError(error, "create"),
      refetchQueries: updateCache ? [{ query: GET_CONTAINERS }] : undefined,
   });

   const createContainer = useCallback(
      async (input: CreateContainerInput): Promise<Container | undefined> => {
         try {
            const result = await createContainerMutation({ variables: { input } });
            return result.data?.createContainer;
         } catch (error) {
            console.error("Error creating container:", error);
            return undefined;
         }
      },
      [createContainerMutation]
   );

   // ===============================
   // MUTATION: ACTUALIZAR CONTENEDOR
   // ===============================

   const [updateContainerMutation, updateContainerMutationResult] = useMutation<
      UpdateContainerData,
      UpdateContainerVars
   >(UPDATE_CONTAINER, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "update"),
      onError: (error) => mutationOptions.onError(error, "update"),
   });

   const updateContainer = useCallback(
      async (input: UpdateContainerInput): Promise<Container | undefined> => {
         try {
            const result = await updateContainerMutation({ variables: { input } });
            return result.data?.updateContainer;
         } catch (error) {
            console.error("Error updating container:", error);
            return undefined;
         }
      },
      [updateContainerMutation]
   );

   // ===============================
   // MUTATION: ELIMINAR CONTENEDOR (SOFT DELETE)
   // ===============================

   const [removeContainerMutation, removeContainerMutationResult] = useMutation<
      RemoveContainerData,
      RemoveContainerVars
   >(REMOVE_CONTAINER, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "remove"),
      onError: (error) => mutationOptions.onError(error, "remove"),
      refetchQueries: updateCache ? [{ query: GET_CONTAINERS }] : undefined,
   });

   const removeContainer = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await removeContainerMutation({
               variables: { id },
            });
            return result.data?.removeContainer ?? false;
         } catch (error) {
            console.error("Error removing container:", error);
            return false;
         }
      },
      [removeContainerMutation]
   );

   // ===============================
   // MUTATION: RESTAURAR CONTENEDOR
   // ===============================

   const [restoreContainerMutation, restoreContainerMutationResult] = useMutation<
      RestoreContainerData,
      RestoreContainerVars
   >(RESTORE_CONTAINER, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "restore"),
      onError: (error) => mutationOptions.onError(error, "restore"),
      refetchQueries: updateCache ? [{ query: GET_CONTAINERS }] : undefined,
   });

   const restoreContainer = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await restoreContainerMutation({ variables: { id } });
            return result.data?.restoreContainer ?? false;
         } catch (error) {
            console.error("Error restoring container:", error);
            return false;
         }
      },
      [restoreContainerMutation]
   );

   // ===============================
   // MUTATION: ELIMINAR PERMANENTEMENTE
   // ===============================

   const [hardDeleteContainerMutation, hardDeleteContainerMutationResult] = useMutation<
      HardDeleteContainerData,
      HardDeleteContainerVars
   >(HARD_DELETE_CONTAINER, {
      ...mutationOptions,
      onCompleted: (data) => mutationOptions.onCompleted(data, "hardDelete"),
      onError: (error) => mutationOptions.onError(error, "hardDelete"),
      refetchQueries: updateCache ? [{ query: GET_CONTAINERS }] : undefined,
   });

   const hardDeleteContainer = useCallback(
      async (id: number): Promise<boolean> => {
         try {
            const result = await hardDeleteContainerMutation({
               variables: { id },
            });
            return result.data?.hardDeleteContainer ?? false;
         } catch (error) {
            console.error("Error hard deleting container:", error);
            return false;
         }
      },
      [hardDeleteContainerMutation]
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
      createContainerMutationResult.loading,
      updateContainerMutationResult.loading,
      removeContainerMutationResult.loading,
      restoreContainerMutationResult.loading,
      hardDeleteContainerMutationResult.loading,
   ].some(Boolean);

   return {
      // Crear contenedor
      createContainer,
      createContainerResult: {
         loading: createContainerMutationResult.loading,
         error: createContainerMutationResult.error,
         errorMessage: getErrorMessage(createContainerMutationResult.error),
      },

      // Actualizar contenedor
      updateContainer,
      updateContainerResult: {
         loading: updateContainerMutationResult.loading,
         error: updateContainerMutationResult.error,
         errorMessage: getErrorMessage(updateContainerMutationResult.error),
      },

      // Eliminar contenedor (soft delete)
      removeContainer,
      removeContainerResult: {
         loading: removeContainerMutationResult.loading,
         error: removeContainerMutationResult.error,
         errorMessage: getErrorMessage(removeContainerMutationResult.error),
      },

      // Restaurar contenedor
      restoreContainer,
      restoreContainerResult: {
         loading: restoreContainerMutationResult.loading,
         error: restoreContainerMutationResult.error,
         errorMessage: getErrorMessage(restoreContainerMutationResult.error),
      },

      // Eliminar permanentemente
      hardDeleteContainer,
      hardDeleteContainerResult: {
         loading: hardDeleteContainerMutationResult.loading,
         error: hardDeleteContainerMutationResult.error,
         errorMessage: getErrorMessage(hardDeleteContainerMutationResult.error),
      },

      // Estado global
      isAnyLoading,
   };
}