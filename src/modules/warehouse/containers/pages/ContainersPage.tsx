import { useState, useEffect } from 'react'
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SearchBar } from '@/components/SearchBar'
import Header from '@/components/Header'

import ContainerCard from '../components/ContainerCard'
import ContainerDrawerFilters from '../components/ContainerDrawerFilters'
import ContainerForm from '../components/ContainerForm'
import { useUnifiedContainerFilters } from '../hooks/useUnifiedContainerFilters'
import { useContainers } from '../hooks/useContainers'
import { useContainerMutations } from '../hooks/useContainerMutations'
import type { Container, UnifiedContainerFilters, CreateContainerInput, UpdateContainerInput } from '../types/container.types'

function ContainersPage() {
   // Estado para el formulario
   const [isFormOpen, setIsFormOpen] = useState(false)
   const [selectedContainer, setSelectedContainer] = useState<Container | undefined>(undefined)

   // Estado unificado para filtros
   const {
      filters,
      updateFilter,
      clearFilters,
      hasActiveFilters,
      getBackendFilters,
   } = useUnifiedContainerFilters()

   // Consulta de contenedores con filtros
   const {
      containers,
      loading,
      error,
      refetch,
   } = useContainers({
      filters: getBackendFilters(),
   })

   // Mutaciones de contenedores
   const {
      createContainer,
      createContainerResult: { loading: isCreating },
      updateContainer,
      updateContainerResult: { loading: isUpdating },
      removeContainer,
   } = useContainerMutations({
      onSuccess: (action) => {
         if (action === 'remove') {
            refetch()
            toast('Contenedor eliminado correctamente.')
         } else {
            setIsFormOpen(false)
            setSelectedContainer(undefined)
            refetch()
            toast.success(
               action === 'create' 
                  ? 'Contenedor creado correctamente' 
                  : 'Contenedor actualizado correctamente'
            )
         }
      },
      onError: (action) => {
         toast(`Hubo un error al ${action === 'remove' ? 'eliminar' : 'actualizar'} el contenedor. Por favor, intenta nuevamente.`)
      }
   })

   const onFiltersChange = (key: keyof UnifiedContainerFilters, value: any) => updateFilter(key, value)
   const onClearFilters = () => clearFilters()

   const handleViewDetails = (id: number) => {
      // Implementar navegación cuando se configure el router
      console.log('Ver detalles del contenedor:', id)
   }

   const handleEdit = (id: number) => {
      // Buscar el contenedor por ID y abrir el formulario en modo edición
      const containerToEdit = containers.find(container => container.id === id)
      if (containerToEdit) {
         setSelectedContainer(containerToEdit)
         setIsFormOpen(true)
      } else {
         toast.error('No se encontró el contenedor para editar')
      }
   }

   const handleDelete = async (id: number) => {
      if (window.confirm('¿Estás seguro de que deseas eliminar este contenedor?')) {
         await removeContainer(id)
      }
   }

   // Mostrar toast si hay error de red
   useEffect(() => {
      if (error) {
         toast('No se pudieron cargar los contenedores. Verifica tu conexión a internet.')
      }
   }, [error])

   return (
      <>
         <Header title='Gestión de Contenedores' subtitle='Administra y gestiona tus contenedores'>
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={filters.search || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder='Buscar un contenedor...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>
               <ContainerDrawerFilters
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onClearFilters={onClearFilters}
                  hasActiveFilters={hasActiveFilters}
               />
            </div>

            {/* Botón principal - texto adaptable */}
            <Button
               onClick={() => {
                  setSelectedContainer(undefined)
                  setIsFormOpen(true)
               }}
               className='flex-shrink-0'
            >
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Contenedor</span>
            </Button>
         </Header>

         <div className='p-6 h-full'>
            {loading ? (
               <div className='flex justify-center items-center h-64'>
                  <Loader2 className='h-8 w-8 animate-spin' />
                  <span className='ml-2'>Cargando contenedores...</span>
               </div>
            ) : error ? (
               <Alert variant='destructive' className='mb-6'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                     No se pudieron cargar los contenedores. Verifica tu conexión a internet.
                  </AlertDescription>
               </Alert>
            ) : containers.length === 0 ? (
               <div className='flex flex-col items-center justify-center py-12'>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                     <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     <path d="M32 32L40 24M32 32L24 24M32 32L24 40M32 32L40 40" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className='text-xl font-semibold text-center'>No se encontraron contenedores</h2>
                  <p className='text-muted-foreground mt-2 text-center'>
                     {hasActiveFilters
                        ? 'Prueba a cambiar los filtros o realizar otra búsqueda.'
                        : 'No hay contenedores registrados aún.'}
                  </p>
               </div>
            ) : (
               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {containers.map(container => (
                     <ContainerCard
                        key={container.id}
                        container={container}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                     />
                  ))}
               </div>
            )}
         </div>

         {/* Formulario de contenedor */}
         <ContainerForm
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            container={selectedContainer}
            onSubmit={(data) => {
               if (selectedContainer) {
                  updateContainer(data as UpdateContainerInput)
               } else {
                  createContainer(data as CreateContainerInput)
               }
            }}
            isSubmitting={selectedContainer ? isUpdating : isCreating}
         />
      </>
   )
}

export default ContainersPage
