import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Route } from '@/routes/warehouse/_WarehouseLayout/warehouses/info/$id'

function WarehouseInfoPage() {

   const { id } = Route.useParams()
   const navigate = Route.useNavigate()

   return (
      <>
         <Header title={`Gestión de Almacenes ${id}`} subtitle='Administra y gestiona tus almacenes'>
            <Button variant='outline' className='flex-shrink-0 text-muted-foreground'
               onClick={() => navigate({ to: '/warehouse/warehouses' })}>
               <ArrowLeft className='h-4 w-4' />
               <span className='hidden sm:inline'>Volver</span>
            </Button>
         </Header>

         <div className='p-6 space-y-6'>

         </div>
      </>
   )
}

export default WarehouseInfoPage
