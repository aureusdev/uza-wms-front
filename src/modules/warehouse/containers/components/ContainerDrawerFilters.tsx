import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import type {
   UnifiedContainerFilters
} from '../types/container.types'
import { ContainerStatus } from '../types/container.types'
import Drawer from '@/components/Drawer'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DrawerClose } from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Filter, X } from 'lucide-react'
import { useCallback } from 'react'
import { Badge } from '@/components/ui/badge'

interface ContainerFiltersProps {
   filters: UnifiedContainerFilters
   onFiltersChange: (key: keyof UnifiedContainerFilters, value: any) => void
   onClearFilters: () => void
   hasActiveFilters: boolean
}

function ContainerDrawerFilters({
   filters,
   onFiltersChange,
   onClearFilters,
   hasActiveFilters
}: ContainerFiltersProps) {

   // Helper para actualizar filtros limpiando valores vacíos
   const updateFilter = useCallback((key: keyof UnifiedContainerFilters, value: any) => {
      const cleanValue = value === "" ? undefined : value
      onFiltersChange(key, cleanValue)
   }, [onFiltersChange])

   // Manejar cambio de búsqueda
   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter('search', e.target.value)
   }, [updateFilter])

   return (
      <Drawer
         title='Filtros de Contenedores'
         description='Ajusta los criterios para buscar y filtrar contenedores.'
         trigger={
            <Button variant='outline' className='flex items-center relative'>
               <Filter className='h-4 w-4' />
               <span className='hidden sm:inline'>Filtros</span>
               {hasActiveFilters && (
                  <Badge
                     variant="destructive"
                     className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                     !
                  </Badge>
               )}
            </Button>
         }
         footer={
            <>
               <DrawerClose asChild>
                  <Button
                     variant="outline"
                     onClick={onClearFilters}
                     className="w-full bg-transparent"
                     disabled={!hasActiveFilters}
                  >
                     <X className="h-4 w-4" />
                     Limpiar Filtros
                  </Button>
               </DrawerClose>
               <DrawerClose asChild>
                  <Button className="w-full">
                     Aplicar Filtros
                  </Button>
               </DrawerClose>
            </>
         }
      >
         {/* Filtros */}
         <div className="space-y-6">

            {/* Búsqueda en mobile */}
            <div className="space-y-2 md:hidden">
               <Label className="text-sm font-medium">Búsqueda</Label>
               <SearchBar
                  value={filters.search || ''}
                  onChange={handleSearchChange}
                  placeholder='Buscar un contenedor...'
               />
            </div>

            <Separator className="md:hidden" />

            {/* Estado del Contenedor */}
            <div className="space-y-4">
               <Label className="text-sm font-medium">Estado del Contenedor</Label>
               <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">Todos los estados</SelectItem>
                     <SelectItem value={ContainerStatus.AVAILABLE}>Disponible</SelectItem>
                     <SelectItem value={ContainerStatus.INACTIVE}>Inactivo</SelectItem>
                     <SelectItem value={ContainerStatus.IN_REVIEW}>En revisión</SelectItem>
                     <SelectItem value={ContainerStatus.ASSIGNED}>Asignado</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <Separator />

            {/* Estado de Elementos */}
            <div className="space-y-4">
               <Label className="text-sm font-medium">Estado de Elementos</Label>
               <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="withDeleted"
                        checked={filters.withDeleted || false}
                        onCheckedChange={(checked) => updateFilter("withDeleted", checked)}
                     />
                     <Label htmlFor="withDeleted" className="text-sm">
                        Incluir elementos eliminados
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="onlyDeleted"
                        checked={filters.onlyDeleted || false}
                        onCheckedChange={(checked) => updateFilter("onlyDeleted", checked)}
                     />
                     <Label htmlFor="onlyDeleted" className="text-sm">
                        Solo elementos eliminados
                     </Label>
                  </div>
               </div>
            </div>

            <Separator />

            {/* Ordenamiento */}
            <div className="space-y-4">
               <Label className="text-sm font-medium">Ordenamiento</Label>
               <div className="space-y-3">
                  <div className="space-y-2">
                     <Label htmlFor="sortBy" className="text-xs text-muted-foreground">
                        Ordenar por
                     </Label>
                     <Select
                        value={filters.sortBy || "createdAt"}
                        onValueChange={(value) => updateFilter("sortBy", value)}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Seleccionar campo" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="createdAt">Fecha de creación</SelectItem>
                           <SelectItem value="updatedAt">Fecha de actualización</SelectItem>
                           <SelectItem value="code">Código</SelectItem>
                           <SelectItem value="name">Nombre</SelectItem>
                           <SelectItem value="status">Estado</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">
                        Orden
                     </Label>
                     <Select
                        value={filters.sortOrder || "DESC"}
                        onValueChange={(value) => updateFilter("sortOrder", value)}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Seleccionar orden" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="ASC">Ascendente</SelectItem>
                           <SelectItem value="DESC">Descendente</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>

         </div>
      </Drawer>
   )
}

export default ContainerDrawerFilters
