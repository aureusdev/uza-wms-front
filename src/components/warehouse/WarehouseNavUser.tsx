import {
   BellIcon,
   LogOutIcon,
   MoreVerticalIcon,
   UserCircleIcon,
   Sun,
   Moon
} from "lucide-react"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@auth/contexts/AuthContext"
import { UserAvatar } from "@auth/components/UserAvatar"
import type { User } from "@/modules/shared/auth/types/auth.types"
import { useTheme } from "next-themes"

interface WarehouseNavUserProps {
   user: User
}

function WarehouseNavUser({ user }: WarehouseNavUserProps) {
   const { isMobile } = useSidebar()
   const { logout } = useAuth()
   const navigate = useNavigate()
   const { theme, setTheme } = useTheme()

   const displayName = `${user.firstName} ${user.lastName}`.trim()

   const handleLogout = () => {
      logout()
      navigate({ to: '/login' })
   }

   const handleProfileClick = () => {
      navigate({ to: '/warehouse/profile' })
   }

   const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
   }

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <UserAvatar
                        user={user}
                        size="sm"
                        className="rounded-lg"
                     />
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                           {user.email || 'Sin email'}
                        </span>
                     </div>
                     <MoreVerticalIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="p-0 font-normal">
                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <UserAvatar
                           user={user}
                           size="sm"
                           className="rounded-lg"
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-medium">{displayName}</span>
                           <span className="truncate text-xs text-muted-foreground">
                              {user.email || 'Sin email'}
                           </span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem onClick={handleProfileClick}>
                        <UserCircleIcon className="mr-2 h-4 w-4" />
                        Mi Perfil
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={toggleTheme}>
                        {theme === 'light' ? (
                           <>
                              <Moon className="mr-2 h-4 w-4" />
                              Modo oscuro
                           </>
                        ) : (
                           <>
                              <Sun className="mr-2 h-4 w-4" />
                              Modo claro
                           </>
                        )}
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <BellIcon className="mr-2 h-4 w-4" />
                        Notificaciones
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                     <LogOutIcon className="mr-2 h-4 w-4" />
                     Cerrar sesión
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   )
}

export default WarehouseNavUser