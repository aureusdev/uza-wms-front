import { gql } from '@apollo/client';

export const GET_ITEM_CATEGORIES = gql`
  query GetItemCategories($filters: FindItemCategoriesDto) {
    itemCategories(filters: $filters) {
      items {
        id
        name
        description
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

export const GET_ITEM_CATEGORY = gql`
  query GetItemCategory($id: Int!) {
    itemCategory(id: $id) {
      id
      name
      description
      items {
        id
        name
        code
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_ITEM_CATEGORY_BY_NAME = gql`
  query GetItemCategoryByName($name: String!) {
    itemCategoryByName(name: $name) {
      id
      name
      description
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const IS_ITEM_CATEGORY_NAME_AVAILABLE = gql`
  query IsItemCategoryNameAvailable($name: String!, $excludeId: Int) {
    isItemCategoryNameAvailable(name: $name, excludeId: $excludeId)
  }
`;