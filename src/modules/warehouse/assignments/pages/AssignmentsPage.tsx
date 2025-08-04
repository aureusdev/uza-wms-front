import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { ClipboardList, PlusCircle } from 'lucide-react'

function AssignmentsPage() {
   return (
      <div>
         <Header
            title='Gestión de Asignaciones'
            subtitle='Administra y gestiona tus asignaciones'
            icon={ClipboardList}
         >
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={''}
                  onChange={() => { }}
                  placeholder='Buscar una asignación...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>

            </div>

            {/* Botón principal - texto adaptable */}
            <Button onClick={() => { }} className='flex-shrink-0'>
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Asignación</span>
               <span className='sm:hidden'>Agregar</span>
            </Button>
         </Header>
      </div>
   )
}

export default AssignmentsPage
