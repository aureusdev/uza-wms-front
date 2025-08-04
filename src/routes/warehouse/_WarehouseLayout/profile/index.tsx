import { useAuth } from '@auth/contexts/AuthContext'
import { UserProfile } from '@auth/components/UserProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/warehouse/_WarehouseLayout/profile/')({
   component: ProfilePage,
})

function ProfilePage() {
   const { user } = useAuth()

   if (!user) {
      return (
         <Card>
            <CardContent className="p-6">
               <p className="text-slate-500">No se pudo cargar la información del usuario.</p>
            </CardContent>
         </Card>
      )
   }

   return (
      <div className="space-y-6">




         <div>
            <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
            <p className="text-slate-600">Información de tu cuenta y configuración</p>
         </div>

         {/* Perfil completo del usuario */}
         <UserProfile
            user={user}
            showRoles={true}
            showTechnician={true}
         />

         {/* Ejemplo de perfil compacto */}
         <Card>
            <CardHeader>
               <CardTitle>Vista Compacta</CardTitle>
            </CardHeader>
            <CardContent>
               <UserProfile
                  user={user}
                  compact={true}
                  className="p-4 bg-slate-50 rounded-lg"
               />
            </CardContent>
         </Card>
      </div>
   )
}