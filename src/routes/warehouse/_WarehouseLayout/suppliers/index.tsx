import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, Truck } from 'lucide-react'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/suppliers/'
)({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <Header
            title='Gestión de Proveedores'
            subtitle='Administra y gestiona tus proveedores'
            icon={Truck}
         >
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={""}
                  onChange={() => { }}
                  placeholder='Buscar un proveedor...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>

            </div>

            {/* Botón principal - texto adaptable */}
            <Button onClick={() => { }} className='flex-shrink-0'>
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Proveedor</span>
               <span className='sm:hidden'>Agregar</span>
            </Button>
         </Header>
      </div>
   )
}
