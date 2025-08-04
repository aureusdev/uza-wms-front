import { isAuthenticated } from '@auth/utils/authRouter.util';
import { Outlet, redirect, createFileRoute } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { WarehouseSidebar } from '@/components/warehouse/WarehouseSidebar';
import { useAuth } from '@auth/contexts/AuthContext';

export const Route = createFileRoute('/warehouse/_WarehouseLayout')({
   component: RouteComponent,
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({
            to: '/login',
         });
      }
   }
})

function RouteComponent() {
   const { user, isLoading } = useAuth()

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      )
   }

   if (!user) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
               <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
            </div>
         </div>
      )
   }

   return (
      <SidebarProvider>
         <WarehouseSidebar user={user} />
         <SidebarInset>
            <Outlet />
         </SidebarInset>
      </SidebarProvider>
   )
}
