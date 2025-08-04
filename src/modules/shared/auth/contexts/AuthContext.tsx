import React, { createContext, useContext, useEffect, useState, type ReactNode, } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, REFRESH_TOKEN_MUTATION, GET_CURRENT_USER } from '../graphql/auth.mutations';
import { TokenService } from '../services/tokenService';
import type { AuthContextType, AuthState, LoginInput, LoginResponse } from '../types/auth.types';


// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
   children: ReactNode;
}

/**
 * Provider de autenticación que maneja el estado global del usuario
 * y proporciona funciones para login, logout y verificación de permisos
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [authState, setAuthState] = useState<AuthState>({
      user: null,
      isAuthenticated: false,
      isLoading: true,
   });

   // Mutations
   const [loginMutation] = useMutation(LOGIN_MUTATION);
   const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

   // Query para obtener el usuario actual
   const { data: currentUserData, loading: currentUserLoading, refetch: refetchCurrentUser } = useQuery(GET_CURRENT_USER, {
      skip: !TokenService.isAuthenticated(),
      errorPolicy: 'ignore',
   });

   /**
    * Inicializar el estado de autenticación al cargar la aplicación
    */
   useEffect(() => {
      const initializeAuth = async () => {
         const isAuthenticated = TokenService.isAuthenticated();
         const userData = TokenService.getUserData();

         if (isAuthenticated && userData) {
            setAuthState({
               user: userData,
               isAuthenticated: true,
               isLoading: false,
            });

            // Refrescar datos del usuario desde el servidor
            try {
               await refetchCurrentUser();
            } catch (error) {
               console.error('Error al obtener datos del usuario:', error);
            }
         } else {
            setAuthState({
               user: null,
               isAuthenticated: false,
               isLoading: false,
            });
         }
      };

      initializeAuth();
   }, [refetchCurrentUser]);

   /**
    * Actualizar el estado cuando se reciban datos del usuario actual
    */
   useEffect(() => {
      if (currentUserData?.me && !currentUserLoading) {
         const user = currentUserData.me;
         setAuthState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false,
         }));

         // Actualizar datos en localStorage
         TokenService.setTokens(
            TokenService.getAccessToken() || '',
            TokenService.getRefreshToken() || '',
            user
         );
      }
   }, [currentUserData, currentUserLoading]);

   /**
    * Función para iniciar sesión
    */
   const login = async (credentials: LoginInput): Promise<LoginResponse> => {
      try {
         setAuthState(prev => ({ ...prev, isLoading: true }));

         const { data } = await loginMutation({
            variables: { loginInput: credentials },
         });

         if (data?.login) {
            const loginResponse: LoginResponse = data.login;

            // Guardar tokens y datos del usuario
            TokenService.setTokens(
               loginResponse.accessToken,
               loginResponse.refreshToken,
               loginResponse.user
            );

            // Actualizar estado
            setAuthState({
               user: loginResponse.user,
               isAuthenticated: true,
               isLoading: false,
            });

            return loginResponse;
         } else {
            throw new Error('Error en la respuesta del servidor');
         }
      } catch (error) {
         setAuthState(prev => ({ ...prev, isLoading: false }));
         throw error;
      }
   };

   /**
    * Función para cerrar sesión
    */
   const logout = (): void => {
      TokenService.clearTokens();
      setAuthState({
         user: null,
         isAuthenticated: false,
         isLoading: false,
      });

      // Redirigir al login
      window.location.href = '/login';
   };

   /**
    * Función para refrescar el token
    */
   const refreshToken = async (): Promise<void> => {
      try {
         const currentRefreshToken = TokenService.getRefreshToken();

         if (!currentRefreshToken) {
            logout();
            return;
         }

         const { data } = await refreshTokenMutation({
            variables: {
               refreshTokenInput: { refreshToken: currentRefreshToken }
            }
         });

         if (data?.refreshToken) {
            const refreshResponse = data.refreshToken;

            // Actualizar tokens
            TokenService.setTokens(
               refreshResponse.accessToken,
               refreshResponse.refreshToken,
               refreshResponse.user
            );

            // Actualizar estado
            setAuthState({
               user: refreshResponse.user,
               isAuthenticated: true,
               isLoading: false,
            });
         } else {
            logout();
         }
      } catch (error) {
         console.error('Error al refrescar token:', error);
         logout();
      }
   };

   /**
    * Verifica si el usuario tiene un permiso específico
    */
   const hasPermission = (resource: string, action: string): boolean => {
      if (!authState.user?.userRoles) return false;

      return authState.user.userRoles.some(userRole =>
         userRole.role.permissions?.some(rolePermission =>
            rolePermission.permission.resource === resource &&
            rolePermission.permission.actions.includes(action)
         )
      );
   };

   /**
    * Verifica si el usuario tiene un rol específico
    */
   const hasRole = (roleName: string): boolean => {
      if (!authState.user?.userRoles) return false;

      return authState.user.userRoles.some(userRole =>
         userRole.role.name === roleName
      );
   };

   const contextValue: AuthContextType = {
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      login,
      logout,
      refreshToken,
      hasPermission,
      hasRole,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);

   if (context === undefined) {
      throw new Error('useAuth debe ser usado dentro de un AuthProvider');
   }

   return context;
};