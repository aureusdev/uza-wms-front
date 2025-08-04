import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthGuardOptions {
   requiredPermission?: {
      resource: string;
      action: string;
   };
   requiredRole?: string;
   redirectTo?: string;
   onUnauthorized?: () => void;
}

/**
 * Hook para proteger componentes y páginas con verificación de autenticación y permisos
 * Redirige automáticamente si el usuario no tiene los permisos necesarios
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
   const {
      requiredPermission,
      requiredRole,
      redirectTo = '/login',
      onUnauthorized
   } = options;

   const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();

   useEffect(() => {
      // No hacer nada mientras se está cargando
      if (isLoading) return;

      // Verificar autenticación
      if (!isAuthenticated) {
         if (onUnauthorized) {
            onUnauthorized();
         } else {
            window.location.href = redirectTo;
         }
         return;
      }

      // Verificar permisos específicos
      if (requiredPermission) {
         const hasRequiredPermission = hasPermission(
            requiredPermission.resource,
            requiredPermission.action
         );

         if (!hasRequiredPermission) {
            if (onUnauthorized) {
               onUnauthorized();
            } else {
               console.warn(`Acceso denegado: Se requiere permiso ${requiredPermission.action} en ${requiredPermission.resource}`);
               window.location.href = '/unauthorized';
            }
            return;
         }
      }

      // Verificar rol específico
      if (requiredRole) {
         const hasRequiredRole = hasRole(requiredRole);

         if (!hasRequiredRole) {
            if (onUnauthorized) {
               onUnauthorized();
            } else {
               console.warn(`Acceso denegado: Se requiere rol ${requiredRole}`);
               window.location.href = '/unauthorized';
            }
            return;
         }
      }
   }, [isAuthenticated, isLoading, requiredPermission, requiredRole, hasPermission, hasRole, redirectTo, onUnauthorized]);

   return {
      isAuthenticated,
      isLoading,
      hasPermission,
      hasRole,
   };
};