import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { getInitials, getAvatarColor } from '../utils/avatarUtils';
import type { User as UserType } from '../types/auth.types';

interface UserAvatarProps {
   user: UserType | null;
   size?: 'sm' | 'md' | 'lg' | 'xl';
   className?: string;
   showFallback?: boolean;
}

const sizeClasses = {
   sm: 'h-8 w-8',
   md: 'h-10 w-10',
   lg: 'h-12 w-12',
   xl: 'h-16 w-16',
};

const iconSizes = {
   sm: 'h-4 w-4',
   md: 'h-5 w-5',
   lg: 'h-6 w-6',
   xl: 'h-8 w-8',
};

/**
 * Componente reutilizable para mostrar avatares de usuario
 * Maneja automáticamente fallbacks cuando no hay avatar disponible
 */
export function UserAvatar({ 
   user, 
   size = 'md', 
   className = '', 
   showFallback = true 
}: UserAvatarProps) {
   if (!user) {
      if (!showFallback) return null;
      
      return (
         <Avatar className={`${sizeClasses[size]} ${className}`}>
            <AvatarFallback className="bg-slate-200 text-slate-600">
               <User className={iconSizes[size]} />
            </AvatarFallback>
         </Avatar>
      );
   }

   const displayName = `${user.firstName} ${user.lastName}`.trim();
   const avatarUrl = user.profile?.avatarUrl;

   return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
         {avatarUrl && (
            <AvatarImage
               src={avatarUrl}
               alt={displayName || 'Usuario'}
            />
         )}
         <AvatarFallback className={`font-medium ${getAvatarColor(displayName)}`}>
            {displayName
               ? getInitials(displayName)
               : <User className={iconSizes[size]} />
            }
         </AvatarFallback>
      </Avatar>
   );
}