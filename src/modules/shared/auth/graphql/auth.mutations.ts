import { gql } from '@apollo/client';

/**
 * Mutation para iniciar sesión
 */
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
        phone
        isActive
        lastLogin
        isTechnician
        profile {
          id
          avatarUrl
          bio
        }
        userRoles {
          id
          scopes
          role {
            id
            name
            description
            isSystem
          }
        }
        technicianProfile {
          id
          isActive
          specialization {
            id
            name
            description
          }
        }
      }
      authCredential {
        id
        username
      }
    }
  }
`;

/**
 * Mutation para refrescar token
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshTokenInput: RefreshTokenInput!) {
    refreshToken(refreshTokenInput: $refreshTokenInput) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
        phone
        isActive
        lastLogin
        isTechnician
        profile {
          id
          avatarUrl
          bio
        }
        userRoles {
          id
          scopes
          role {
            id
            name
            description
            isSystem
          }
        }
        technicianProfile {
          id
          isActive
          specialization {
            id
            name
            description
          }
        }
      }
      authCredential {
        id
        username
      }
    }
  }
`;

/**
 * Query para obtener el perfil del usuario actual
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      firstName
      lastName
      email
      phone
      isActive
      lastLogin
      isTechnician
      profile {
        id
        avatarUrl
        bio
      }
      userRoles {
        id
        scopes
        role {
          id
          name
          description
          isSystem
          permissions {
            id
            permission {
              id
              name
              description
              resource
              actions
            }
          }
        }
      }
      technicianProfile {
        id
        isActive
        specialization {
          id
          name
          description
        }
      }
    }
  }
`;