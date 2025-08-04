import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftRight, PlusCircle } from 'lucide-react'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/stock-transfers/',
)({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <Header
            title='Gestión de Transferencias'
            subtitle='Administra y gestiona tus transferencias'
            icon={ArrowLeftRight}
         >
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={""}
                  onChange={() => { }}
                  placeholder='Buscar una transferencia...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>

            </div>

            {/* Botón principal - texto adaptable */}
            <Button onClick={() => { }} className='flex-shrink-0'>
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Transferencia</span>
               <span className='sm:hidden'>Agregar</span>
            </Button>
         </Header>
      </div>
   )
}
