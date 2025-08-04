import { gql } from '@apollo/client';

export const CREATE_ITEM_CATEGORY = gql`
  mutation CreateItemCategory($input: CreateItemCategoryInput!) {
    createItemCategory(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ITEM_CATEGORY = gql`
  mutation UpdateItemCategory($input: UpdateItemCategoryInput!) {
    updateItemCategory(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ITEM_CATEGORY = gql`
  mutation RemoveItemCategory($id: Int!) {
    removeItemCategory(id: $id)
  }
`;

export const RESTORE_ITEM_CATEGORY = gql`
  mutation RestoreItemCategory($id: Int!) {
    restoreItemCategory(id: $id)
  }
`;

export const HARD_DELETE_ITEM_CATEGORY = gql`
  mutation HardDeleteItemCategory($id: Int!) {
    hardDeleteItemCategory(id: $id)
  }
`;