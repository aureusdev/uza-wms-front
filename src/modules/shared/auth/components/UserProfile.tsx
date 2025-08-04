import { UserAvatar } from './UserAvatar';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Shield } from "lucide-react";
import type { User } from '../types/auth.types';

interface UserProfileProps {
   user: User;
   showRoles?: boolean;
   showTechnician?: boolean;
   compact?: boolean;
   className?: string;
}

/**
 * Componente para mostrar información completa del perfil de usuario
 * Incluye avatar, información personal, roles y perfil técnico si aplica
 */
export function UserProfile({ 
   user, 
   showRoles = true, 
   showTechnician = true, 
   compact = false,
   className = '' 
}: UserProfileProps) {
   const displayName = `${user.firstName} ${user.lastName}`.trim();
   const hasProfile = !!user.profile;
   const hasTechnicianProfile = !!user.technicianProfile;

   if (compact) {
      return (
         <div className={`flex items-center space-x-3 ${className}`}>
            <UserAvatar user={user} size="sm" />
            <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-slate-900 truncate">
                  {displayName}
               </p>
               {user.email && (
                  <p className="text-xs text-slate-500 truncate">
                     {user.email}
                  </p>
               )}
            </div>
            {!user.isActive && (
               <Badge variant="secondary" className="text-xs">
                  Inactivo
               </Badge>
            )}
         </div>
      );
   }

   return (
      <Card className={className}>
         <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
               <UserAvatar user={user} size="lg" />
               <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                     {displayName}
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2">
                     {user.email && (
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                           <Mail className="h-4 w-4" />
                           <span>{user.email}</span>
                        </div>
                     )}
                     {user.phone && (
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                           <Phone className="h-4 w-4" />
                           <span>{user.phone}</span>
                        </div>
                     )}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                     <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Activo" : "Inactivo"}
                     </Badge>
                     {user.isTechnician && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                           <Shield className="h-3 w-3 mr-1" />
                           Técnico
                        </Badge>
                     )}
                  </div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            {/* Información del perfil */}
            {hasProfile && user.profile?.bio && (
               <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Biografía</h4>
                  <p className="text-sm text-slate-600">{user.profile.bio}</p>
               </div>
            )}

            {/* Roles del usuario */}
            {showRoles && user.userRoles && user.userRoles.length > 0 && (
               <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Roles</h4>
                  <div className="flex flex-wrap gap-2">
                     {user.userRoles.map((userRole) => (
                        <Badge key={userRole.id} variant="outline">
                           {userRole.role.name}
                        </Badge>
                     ))}
                  </div>
               </div>
            )}

            {/* Perfil técnico */}
            {showTechnician && hasTechnicianProfile && user.technicianProfile && (
               <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Perfil Técnico</h4>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Estado:</span>
                        <Badge variant={user.technicianProfile.isActive ? "default" : "secondary"}>
                           {user.technicianProfile.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                     </div>
                     {user.technicianProfile.specialization && (
                        <div>
                           <span className="text-sm text-slate-600">Especialización:</span>
                           <div className="mt-1">
                              <Badge variant="outline" className="text-purple-600 border-purple-200">
                                 {user.technicianProfile.specialization.name}
                              </Badge>
                              {user.technicianProfile.specialization.description && (
                                 <p className="text-xs text-slate-500 mt-1">
                                    {user.technicianProfile.specialization.description}
                                 </p>
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* Información adicional */}
            <div className="pt-2 border-t border-slate-100">
               <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>ID: {user.id}</span>
                  {user.lastLogin && (
                     <span>Último acceso: {new Date(user.lastLogin).toLocaleDateString()}</span>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   );
}