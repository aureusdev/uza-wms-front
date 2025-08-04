import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, ShoppingCart } from 'lucide-react'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/purchases/'
)({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <Header
            title='Gestión de Compras'
            subtitle='Administra y gestiona tus compras'
            icon={ShoppingCart}
         >
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={""}
                  onChange={() => { }}
                  placeholder='Buscar una compra...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>
               
            </div>

            {/* Botón principal - texto adaptable */}
            <Button onClick={() => { }} className='flex-shrink-0'>
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Compra</span>
               <span className='sm:hidden'>Agregar</span>
            </Button>
         </Header>
      </div>
   )
}
