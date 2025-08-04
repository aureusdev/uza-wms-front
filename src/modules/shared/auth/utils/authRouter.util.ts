import { redirect } from '@tanstack/react-router';
import { TokenService } from '../services/tokenService';

/**
 * Utilidades para integración con TanStack Router
 */

/**
 * Verifica si el usuario está autenticado
 * Compatible con TS Router beforeLoad
 */
export const isAuthenticated = (): boolean => {
   return TokenService.isAuthenticated();
};

/**
 * Obtiene los datos del usuario actual
 */
export const getCurrentUser = () => {
   return TokenService.getUserData();
};

/**
 * Verifica si el usuario tiene un permiso específico
 */
export const hasPermission = (resource: string, action: string): boolean => {
   const userData = TokenService.getUserData();

   if (!userData?.userRoles) return false;

   return userData.userRoles.some((userRole: any) =>
      userRole.role.rolePermissions?.some((rolePermission: any) =>
         rolePermission.permission.resource === resource &&
         rolePermission.permission.action === action
      )
   );
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (roleName: string): boolean => {
   const userData = TokenService.getUserData();

   if (!userData?.userRoles) return false;

   return userData.userRoles.some((userRole: any) =>
      userRole.role.name === roleName
   );
};

/**
 * Guard para rutas que requieren autenticación
 * Uso en beforeLoad de TS Router
 */
export const requireAuth = (redirectTo?: string) => {
   if (!isAuthenticated()) {
      throw redirect({
         to: '/login',
         search: {
            redirectTo: redirectTo || window.location.pathname
         }
      });
   }
};

/**
 * Guard para rutas que requieren permisos específicos
 */
export const requirePermission = (resource: string, action: string, redirectTo?: string) => {
   // Primero verificar autenticación
   requireAuth(redirectTo);

   // Luego verificar permisos
   if (!hasPermission(resource, action)) {
      throw redirect({
         to: '/unauthorized',
         search: {
            requiredPermission: `${action} on ${resource}`,
            redirectTo: redirectTo || window.location.pathname
         }
      });
   }
};

/**
 * Guard para rutas que requieren roles específicos
 */
export const requireRole = (roleName: string, redirectTo?: string) => {
   // Primero verificar autenticación
   requireAuth(redirectTo);

   // Luego verificar rol
   if (!hasRole(roleName)) {
      throw redirect({
         to: '/unauthorized',
         search: {
            requiredRole: roleName,
            redirectTo: redirectTo || window.location.pathname
         }
      });
   }
};

/**
 * Guard combinado para múltiples verificaciones
 */
export const requireAuthAndPermissions = (options: {
   permissions?: Array<{ resource: string; action: string }>;
   roles?: string[];
   requireAll?: boolean; // true = AND, false = OR
   redirectTo?: string;
}) => {
   const { permissions = [], roles = [], requireAll = true, redirectTo } = options;

   // Verificar autenticación primero
   requireAuth(redirectTo);

   // Verificar permisos si se especifican
   if (permissions.length > 0) {
      const hasRequiredPermissions = requireAll
         ? permissions.every(p => hasPermission(p.resource, p.action))
         : permissions.some(p => hasPermission(p.resource, p.action));

      if (!hasRequiredPermissions) {
         throw redirect({
            to: '/unauthorized',
            search: {
               requiredPermissions: permissions.map(p => `${p.action} on ${p.resource}`).join(', '),
               redirectTo: redirectTo || window.location.pathname
            }
         });
      }
   }

   // Verificar roles si se especifican
   if (roles.length > 0) {
      const hasRequiredRoles = requireAll
         ? roles.every(role => hasRole(role))
         : roles.some(role => hasRole(role));

      if (!hasRequiredRoles) {
         throw redirect({
            to: '/unauthorized',
            search: {
               requiredRoles: roles.join(', '),
               redirectTo: redirectTo || window.location.pathname
            }
         });
      }
   }
};