import Header from '@/components/Header'
import { createFileRoute } from '@tanstack/react-router'
import { Tags } from 'lucide-react'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/categories/'
)({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <Header
            title='Gestión de Categorías'
            subtitle='Administra y gestiona tus categorías'
            icon={Tags}
         >

         </Header>
      </div>
   )
}
