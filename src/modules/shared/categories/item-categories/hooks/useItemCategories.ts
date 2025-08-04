import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'sonner';
import {
   GET_ITEM_CATEGORIES,
   GET_ITEM_CATEGORY,
   GET_ITEM_CATEGORY_BY_NAME,
   IS_ITEM_CATEGORY_NAME_AVAILABLE
} from '../graphql/item-categories.queries';
import {
   CREATE_ITEM_CATEGORY,
   UPDATE_ITEM_CATEGORY,
   REMOVE_ITEM_CATEGORY,
   RESTORE_ITEM_CATEGORY,
   HARD_DELETE_ITEM_CATEGORY
} from '../graphql/item-categories.mutations';
import type {
   ItemCategory,
   CreateItemCategoryInput,
   UpdateItemCategoryInput,
   ItemCategoryFiltersInput,
   PaginatedItemCategories
} from '../types/item-category.types';

/**
 * Hook para obtener lista de categorías de items con filtros y paginación
 */
export function useItemCategories(filters?: ItemCategoryFiltersInput) {
   return useQuery<{ itemCategories: PaginatedItemCategories }>(GET_ITEM_CATEGORIES, {
      variables: { filters },
      errorPolicy: 'all',
   });
}

/**
 * Hook para obtener una categoría de item por ID
 */
export function useItemCategory(id: number) {
   return useQuery<{ itemCategory: ItemCategory }>(GET_ITEM_CATEGORY, {
      variables: { id },
      skip: !id,
      errorPolicy: 'all',
   });
}

/**
 * Hook para obtener una categoría de item por nombre
 */
export function useItemCategoryByName(name: string) {
   return useQuery<{ itemCategoryByName: ItemCategory | null }>(GET_ITEM_CATEGORY_BY_NAME, {
      variables: { name },
      skip: !name,
      errorPolicy: 'all',
   });
}

/**
 * Hook para verificar si un nombre de categoría está disponible
 */
export function useIsItemCategoryNameAvailable(name: string, excludeId?: number) {
   return useQuery<{ isItemCategoryNameAvailable: boolean }>(IS_ITEM_CATEGORY_NAME_AVAILABLE, {
      variables: { name, excludeId },
      skip: !name,
      errorPolicy: 'all',
   });
}

/**
 * Hook para operaciones de mutación de categorías de items
 */
export function useItemCategoryMutations() {
   const client = useApolloClient();

   const [createItemCategoryMutation, { loading: creating }] = useMutation(CREATE_ITEM_CATEGORY, {
      onCompleted: () => {
         toast.success('Categoría de item creada exitosamente');
         client.refetchQueries({ include: [GET_ITEM_CATEGORIES] });
      },
      onError: (error) => {
         toast.error(`Error al crear categoría: ${error.message}`);
      },
   });

   const [updateItemCategoryMutation, { loading: updating }] = useMutation(UPDATE_ITEM_CATEGORY, {
      onCompleted: () => {
         toast.success('Categoría de item actualizada exitosamente');
         client.refetchQueries({ include: [GET_ITEM_CATEGORIES, GET_ITEM_CATEGORY] });
      },
      onError: (error) => {
         toast.error(`Error al actualizar categoría: ${error.message}`);
      },
   });

   const [removeItemCategoryMutation, { loading: removing }] = useMutation(REMOVE_ITEM_CATEGORY, {
      onCompleted: () => {
         toast.success('Categoría de item eliminada exitosamente');
         client.refetchQueries({ include: [GET_ITEM_CATEGORIES] });
      },
      onError: (error) => {
         toast.error(`Error al eliminar categoría: ${error.message}`);
      },
   });

   const [restoreItemCategoryMutation, { loading: restoring }] = useMutation(RESTORE_ITEM_CATEGORY, {
      onCompleted: () => {
         toast.success('Categoría de item restaurada exitosamente');
         client.refetchQueries({ include: [GET_ITEM_CATEGORIES] });
      },
      onError: (error) => {
         toast.error(`Error al restaurar categoría: ${error.message}`);
      },
   });

   const [hardDeleteItemCategoryMutation, { loading: hardDeleting }] = useMutation(HARD_DELETE_ITEM_CATEGORY, {
      onCompleted: () => {
         toast.success('Categoría de item eliminada permanentemente');
         client.refetchQueries({ include: [GET_ITEM_CATEGORIES] });
      },
      onError: (error) => {
         toast.error(`Error al eliminar permanentemente: ${error.message}`);
      },
   });

   const createItemCategory = async (input: CreateItemCategoryInput) => {
      return createItemCategoryMutation({ variables: { input } });
   };

   const updateItemCategory = async (input: UpdateItemCategoryInput) => {
      return updateItemCategoryMutation({ variables: { input } });
   };

   const removeItemCategory = async (id: number) => {
      return removeItemCategoryMutation({ variables: { id } });
   };

   const restoreItemCategory = async (id: number) => {
      return restoreItemCategoryMutation({ variables: { id } });
   };

   const hardDeleteItemCategory = async (id: number) => {
      return hardDeleteItemCategoryMutation({ variables: { id } });
   };

   return {
      createItemCategory,
      updateItemCategory,
      removeItemCategory,
      restoreItemCategory,
      hardDeleteItemCategory,
      loading: creating || updating || removing || restoring || hardDeleting,
   };
}