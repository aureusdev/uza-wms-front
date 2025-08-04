import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes } from 'lucide-react'

export const Route = createFileRoute('/warehouse/_WarehouseLayout/dashboard/')({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <Header
            title='Panel de control'
            subtitle='Información general de la almacén'
            icon={Boxes}
         >
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={""}
                  onChange={() => { }}
                  placeholder='Buscar un producto...'
               />
            </div>
         </Header>
      </div>
   )
}
