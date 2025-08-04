import { useCallback } from 'react'
import Drawer from '@/components/Drawer'
import { DrawerClose } from '@/components/ui/drawer'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'
import type { UnifiedItemFilters } from '@items/types/item.types'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useItemCategories } from '@categories/item-categories/hooks/useItemCategories'

interface ItemFiltersProps {
   filters: UnifiedItemFilters
   onFiltersChange: (key: keyof UnifiedItemFilters, value: any) => void
   onClearFilters: () => void
   hasActiveFilters: boolean
}

function ItemDrawerFilters({
   filters,
   onFiltersChange,
   onClearFilters,
   hasActiveFilters
}: ItemFiltersProps) {

   const { data: categoriesData } = useItemCategories()
   const categories = categoriesData?.itemCategories?.items || []

   // Helper para actualizar filtros limpiando valores vacíos
   const updateFilter = useCallback((key: keyof UnifiedItemFilters, value: any) => {
      const cleanValue = value === "" ? undefined : value
      onFiltersChange(key, cleanValue)
   }, [onFiltersChange])

   // Manejar cambio de búsqueda
   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      updateFilter('search', e.target.value)
   }, [updateFilter])

   return (
      <Drawer
         title='Filtros de Productos'
         description='Ajusta los criterios para buscar y filtrar productos.'
         buttonText='Aplicar Filtros'
         trigger={
            <Button variant="outline" className='flex items-center relative'>
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
         <div className="space-y-6">
            {/* Búsqueda en mobile */}
            <div className="space-y-2 md:hidden">
               <Label className="text-sm font-medium">Búsqueda</Label>
               <SearchBar
                  value={filters.search || ''}
                  onChange={handleSearchChange}
                  placeholder='Buscar un producto...'
               />
            </div>

            <Separator className="md:hidden" />

            {/* Rango de Precio */}
            <div className="space-y-4">
               <Label className="text-sm font-medium">Rango de Precio</Label>
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                     <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                        Precio Mínimo
                     </Label>
                     <Input
                        id="minPrice"
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ""}
                        onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                        Precio Máximo
                     </Label>
                     <Input
                        id="maxPrice"
                        type="number"
                        placeholder="999999"
                        value={filters.maxPrice || ""}
                        onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                     />
                  </div>
               </div>
            </div>

            <Separator />

            {/* Categoría */}
            <div className="space-y-2">
               <Label>Categoría</Label>
               <Select
                  value={filters.itemCategoryId?.toString() || "0"}
                  onValueChange={(value) => updateFilter("itemCategoryId", value === "0" ? undefined : Number(value))}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="0">Todas las categorías</SelectItem>
                     {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                           {category.name}
                        </SelectItem>
                     ))}
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
                           <SelectItem value="brand">Marca</SelectItem>
                           <SelectItem value="price">Precio</SelectItem>
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

export default ItemDrawerFilters