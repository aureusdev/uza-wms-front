import { useState } from 'react'
import Header from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Boxes, PlusCircle, Loader2 } from 'lucide-react'
import ItemForm from '@/modules/warehouse/items/components/ItemForm'
import { useItems } from '@/modules/warehouse/items/hooks/useItems'
import ItemCard from '@/modules/warehouse/items/components/ItemCard'
import { useItemMutations } from '@/modules/warehouse/items/hooks/useItemMutations'
import ItemDrawerFilters from '../components/ItemDrawerFilters'
import { useUnifiedItemFilters } from '../hooks/useUnifiedItemFilters'

function ItemsPage() {
   const [isOpen, setIsOpen] = useState<boolean>(false)

   // Hook unificado para filtros
   const {
      filters,
      updateFilter,
      updateSearch,
      clearFilters,
      clearSearch,
      clearAll,
      hasActiveFilters,
      hasActiveSearch,
      getBackendFilters
   } = useUnifiedItemFilters()

   // Hook para obtener items con filtros
   const {
      items,
      loading,
      error,
      errorMessage,
      pagination,
      refetch
   } = useItems({
      filters: getBackendFilters(),
      options: {
         errorPolicy: 'all'
      }
   })

   const { createItem, updateItem, isAnyLoading } = useItemMutations({
      onSuccess: () => refetch()
   })

   const handleSubmit = async (data: any) => {
      if (data.id) {
         await updateItem(data)
      } else {
         await createItem(data)
      }
      setIsOpen(false)
   }

   return (
      <div>
         <Header
            title='Gestión de Productos'
            subtitle='Administra y gestiona tu catálogo de productos'
         >
            {/* SearchBar */}
            <div className='hidden md:block'>
               <SearchBar
                  value={filters.search || ''}
                  onChange={(e) => updateSearch(e.target.value)}
                  onClear={clearSearch}
                  placeholder='Buscar un producto...'
               />
            </div>

            {/* Filtros */}
            <div className='flex-shrink-0'>
               <ItemDrawerFilters
                  filters={filters}
                  onFiltersChange={updateFilter}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
               />
            </div>

            {/* Botón agregar */}
            <Button onClick={() => setIsOpen(true)} className='flex-shrink-0'>
               <PlusCircle className='h-4 w-4' />
               <span className='hidden sm:inline'>Agregar Producto</span>
            </Button>
         </Header>

         <div className='p-8 h-full'>
            {/* Estado de carga */}
            {loading && (
               <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2 text-muted-foreground">Cargando productos...</span>
               </div>
            )}

            {/* Estado de error */}
            {error && !loading && (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-red-500 mb-2">⚠️ Error al cargar productos</div>
                  <p className="text-muted-foreground mb-4">{errorMessage}</p>
                  <Button onClick={() => refetch()} variant="outline">
                     Reintentar
                  </Button>
               </div>
            )}

            {/* Sin resultados */}
            {!loading && !error && items.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Boxes className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground mb-4">
                     {hasActiveFilters || hasActiveSearch
                        ? 'Intenta ajustar tus criterios de búsqueda o filtros'
                        : 'No hay productos registrados aún'
                     }
                  </p>
                  {(hasActiveFilters || hasActiveSearch) && (
                     <Button onClick={clearAll} variant="outline">
                        Limpiar todo
                     </Button>
                  )}
               </div>
            )}

            {/* Grid de productos */}
            {!loading && !error && items.length > 0 && (
               <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                     {items.map((item) => (
                        <ItemCard
                           key={item.id}
                           item={item}
                        />
                     ))}
                  </div>

                  {/* Paginación */}
                  {pagination.total > 0 && (
                     <div className="mt-8 text-center text-sm text-muted-foreground">
                        Mostrando {pagination.itemCount} de {pagination.total} productos
                        {pagination.totalPages > 1 && (
                           <span> (Página {pagination.page} de {pagination.totalPages})</span>
                        )}
                     </div>
                  )}
               </>
            )}
         </div>

         <ItemForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            loading={isAnyLoading}
         />
      </div>
   )
}

export default ItemsPage