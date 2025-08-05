import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import WarehouseDrawerFilters from '../components/WarehouseDrawerFilters'
import { useUnifiedWarehouseFilters } from '../hooks/useUnifiedWarehouseFilters'
import type { UnifiedWarehouseFilters } from '../types/warehouse.types'
import WarehouseForm from '../components/WarehouseForm'
import { useState, useEffect } from 'react'
import { useWarehouses } from '../hooks/useWarehouses'
import { useWarehouseMutations } from '../hooks/useWarehouseMutations'
import WarehouseCard from '../components/WarehouseCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

function WarehousePage() {
   const {
      filters,
      updateFilter,
      clearFilters,
      hasActiveFilters,
      getBackendFilters
   } = useUnifiedWarehouseFilters()

   // Usar filtros debouncados para evitar consultas por cada letra
   const backendFilters = getBackendFilters()
   const { 
      warehouses, 
      loading, 
      error, 
      refetch,
      lastFetch,
      isCacheHit,
      isRefetching
   } = useWarehouses({ 
      filters: backendFilters,
      enableCaching: true,
      pollingInterval: 0, // Sin polling automático para mejor rendimiento
   })
   
   const { createWarehouse, createWarehouseResult } = useWarehouseMutations({
      onSuccess: (action) => {
         if (action === 'create') {
            setIsFormOpen(false)
            refetch()
            toast("Almacén creado correctamente.")
         }
      },
      onError: (action) => {
         toast(`Hubo un error al ${action === 'create' ? 'crear' : 'actualizar'} el almacén. Por favor, intenta nuevamente.`)
      }
   })
   const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

   const onFiltersChange = (key: keyof UnifiedWarehouseFilters, value: any) => updateFilter(key, value)
   const onClearFilters = () => clearFilters()

   const handleCreateWarehouse = async (data: any) => {
      await createWarehouse(data)
   }

   // Función para refetch manual con feedback
   const handleManualRefresh = useCallback(() => {
      toast.promise(
         refetch(),
         {
            loading: 'Actualizando almacenes...',
            success: 'Almacenes actualizados',
            error: 'Error al actualizar almacenes'
         }
      );
   }, [refetch]);

   // Mostrar toast si hay error de red
   useEffect(() => {
      if (error) {
         toast("No se pudieron cargar los almacenes. Verifica tu conexión a internet.")
      }
   }, [error, toast])

   return (
      <>
         <Header title='Gestión de Almacenes' subtitle='Administra y gestiona tus almacenes'>
            {/* SearchBar - oculto en pantallas muy pequeñas */}
            <div className='hidden md:block'>
               <SearchBar
                  value={filters.search || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder='Buscar un almacén...'
               />
            </div>

            {/* Filtros - solo icono en móvil */}
            <div className='flex-shrink-0'>
               <WarehouseDrawerFilters
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onClearFilters={onClearFilters}
                  hasActiveFilters={hasActiveFilters}
               />
            </div>

            {/* Botón principal - texto adaptable */}
            <Button
               onClick={() => { setIsFormOpen(true) }}
               className='flex-shrink-0'
               disabled={createWarehouseResult.loading}
            >
               {createWarehouseResult.loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
               ) : (
                  <PlusCircle className='h-4 w-4' />
               )}
               <span className='hidden sm:inline'>Agregar Almacén</span>
            </Button>
            
            {/* Botón de refresh manual */}
            <Button
               variant="outline"
               size="sm"
               onClick={handleManualRefresh}
               disabled={loading || isRefetching}
               className="flex-shrink-0"
            >
               {isRefetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
               ) : isCacheHit ? (
                  <Wifi className="h-4 w-4 text-green-600" />
               ) : (
                  <WifiOff className="h-4 w-4" />
               )}
               <span className="hidden lg:inline">
                  {isCacheHit ? 'Cache' : 'Actualizar'}
               </span>
            </Button>
         </Header>

         <div className='p-6 h-full'>
            {/* Indicador de estado de cache */}
            {lastFetch && (
               <div className="mb-4 text-xs text-muted-foreground flex items-center gap-2">
                  {isCacheHit ? (
                     <>
                        <Wifi className="h-3 w-3 text-green-600" />
                        Datos desde cache
                     </>
                  ) : (
                     <>
                        <WifiOff className="h-3 w-3" />
                        Última actualización: {lastFetch.toLocaleTimeString()}
                     </>
                  )}
               </div>
            )}
            
            {loading ? (
               <div className='flex justify-center items-center h-64'>
                  <Loader2 className='h-8 w-8 animate-spin' />
                  <span className='ml-2'>
                     {isCacheHit ? 'Cargando desde cache...' : 'Cargando almacenes...'}
                  </span>
               </div>
            ) : error ? (
               <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                     Hubo un error al cargar los almacenes. Por favor, intenta nuevamente.
                  </AlertDescription>
                  <div className='mt-4'>
                     <Button variant='outline' onClick={handleManualRefresh}>
                        Reintentar
                     </Button>
                  </div>
                  <div className='mt-4'>
                     <Button variant='outline' onClick={() => refetch()}>
                        Reintentar
                     </Button>
                  </div>
               </Alert>
            ) : warehouses.length === 0 ? (
               <div className='flex flex-col items-center justify-center py-12'>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                     <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     <path d="M32 32L40 24M32 32L24 24M32 32L24 40M32 32L40 40" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className='text-xl font-semibold text-center'>No se encontraron almacenes</h2>
                  <p className='text-muted-foreground mt-2 text-center'>
                     {hasActiveFilters
                        ? 'Prueba a cambiar los filtros o realizar otra búsqueda.'
                        : 'No hay almacenes registrados aún.'}
                  </p>
               </div>
            ) : (
               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {warehouses.map((warehouse) => (
                     <WarehouseCard key={warehouse.id} warehouse={warehouse} />
                  ))}
               </div>
            )}
         </div>

         <WarehouseForm
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            onSubmit={handleCreateWarehouse}
            isSubmitting={createWarehouseResult.loading}
         />
      </>
   )
}

export default WarehousePage
