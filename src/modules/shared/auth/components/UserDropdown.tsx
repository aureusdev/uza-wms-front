import { useState } from 'react';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
   User, 
   Settings, 
   LogOut, 
   Shield,
   ChevronDown 
} from "lucide-react";

interface UserDropdownProps {
   showName?: boolean;
   showRole?: boolean;
   className?: string;
}

/**
 * Componente dropdown para mostrar información del usuario y opciones de cuenta
 * Incluye avatar, nombre, rol y opciones como perfil, configuración y logout
 */
export function UserDropdown({ 
   showName = true, 
   showRole = true, 
   className = '' 
}: UserDropdownProps) {
   const { user, logout } = useAuth();
   const [isOpen, setIsOpen] = useState(false);

   if (!user) {
      return null;
   }

   const displayName = `${user.firstName} ${user.lastName}`.trim();
   const primaryRole = user.userRoles?.[0]?.role;

   const handleLogout = () => {
      logout();
   };

   return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
         <DropdownMenuTrigger asChild>
            <Button 
               variant="ghost" 
               className={`flex items-center space-x-2 h-auto p-2 hover:bg-slate-100 ${className}`}
            >
               <UserAvatar user={user} size="sm" />
               {showName && (
                  <div className="flex flex-col items-start min-w-0">
                     <span className="text-sm font-medium text-slate-900 truncate">
                        {displayName}
                     </span>
                     {showRole && primaryRole && (
                        <span className="text-xs text-slate-500 truncate">
                           {primaryRole.name}
                        </span>
                     )}
                  </div>
               )}
               <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
               <div className="flex items-center space-x-2">
                  <UserAvatar user={user} size="sm" />
                  <div className="flex flex-col min-w-0">
                     <span className="font-medium text-slate-900 truncate">
                        {displayName}
                     </span>
                     {user.email && (
                        <span className="text-xs text-slate-500 truncate">
                           {user.email}
                        </span>
                     )}
                  </div>
               </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Estado del usuario */}
            <div className="px-2 py-1">
               <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Estado:</span>
                  <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                     {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
               </div>
               {user.isTechnician && (
                  <div className="flex items-center justify-between mt-1">
                     <span className="text-xs text-slate-500">Perfil:</span>
                     <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Técnico
                     </Badge>
                  </div>
               )}
            </div>

            <DropdownMenuSeparator />

            {/* Opciones del menú */}
            <DropdownMenuItem className="cursor-pointer">
               <User className="h-4 w-4 mr-2" />
               Mi Perfil
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
               <Settings className="h-4 w-4 mr-2" />
               Configuración
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
               className="cursor-pointer text-red-600 focus:text-red-600"
               onClick={handleLogout}
            >
               <LogOut className="h-4 w-4 mr-2" />
               Cerrar Sesión
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}