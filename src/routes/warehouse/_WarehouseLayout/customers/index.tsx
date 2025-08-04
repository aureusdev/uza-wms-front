import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/modules/warehouse/customers'
import CustomerFilters from '@/modules/warehouse/customers/components/CustomerFilters'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, UsersRound } from 'lucide-react'
import { useState } from 'react'


export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/customers/'
)({
   component: RouteComponent,
})


function RouteComponent() {

   const [searchValue, setSearchValue] = useState<string>('');
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleSearchChange = (value: string) => {
      setSearchValue(value);
   }

   const handleOpenDialog = () => {
      setIsFormOpen(true);
   }

   const handleCloseDialog = () => {
      setIsFormOpen(false);
   }

   const handleCreateCustomer = async (data: any) => {
      setLoading(true);
      try {
         // Aquí irá la lógica para crear el cliente
         console.log('Creating customer:', data);

         // Simular una llamada a la API
         await new Promise(resolve => setTimeout(resolve, 1000));

         // Cerrar el modal después de crear
         setIsFormOpen(false);

         // Aquí podrías mostrar un toast de éxito
         // toast.success('Cliente creado exitosamente');

      } catch (error) {
         console.error('Error creating customer:', error);
         // Aquí podrías mostrar un toast de error
         // toast.error('Error al crear el cliente');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div>

         <Header
            title='Gestión de clientes'
            subtitle='Administra y gestiona la información de tus clientes'
            icon={UsersRound}
         >
            <SearchBar
               value={searchValue}
               onChange={(e) => handleSearchChange(e.target.value)}
               placeholder='Buscar un cliente...'
            />
            <CustomerFilters />
            <Button className='gap-2' onClick={handleOpenDialog}>
               <PlusCircle className='h-4 w-4' />
               Agregar Cliente
            </Button>
         </Header>

         <div className=''>

            <div>
            </div>


         </div>


         {/* Modal para el formulario de cliente */}
         <CustomerForm
            onSubmit={handleCreateCustomer}
            onCancel={handleCloseDialog}
            loading={loading}
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
         />


      </div>
   )
}
