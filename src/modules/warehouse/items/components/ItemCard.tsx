import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
   Edit,
   Trash2,
   Eye,
   MoreVertical
} from 'lucide-react'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader
} from '@/components/ui/card'

import type { Item } from '../types/item.types'
import { useNavigate } from '@tanstack/react-router'

interface ItemCardProps {
   item: Item
   onEdit?: (item: Item) => void
   onDelete?: (item: Item) => void
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {

   const navigate = useNavigate()

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-MX', {
         style: 'currency',
         currency: 'MXN',
         minimumFractionDigits: 2,
      }).format(price)
   }

   const handleShowItemInfo = () => {
      return navigate({
         to: '/warehouse/items/info/$id',
         params: {
            id: String(item.id)
         }
      })
   }

   return (
      <Card className='overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full p-0'>
         {/* Imagen del producto */}
         <CardHeader className='relative h-52 bg-secondary overflow-hidden border-b'>
            <img
               className='w-full h-full p-4 object-contain hover:scale-105 transition-transform duration-300'
               src={item.imageUrl ?? '/placeholder.png'}
               alt={item.name}
               loading='lazy'
               onError={(e) => {
                  e.currentTarget.src = '/placeholder.png'
               }}
            />
            <div className='absolute top-3 right-3'>
               <Badge className='text-xs font-medium shadow-sm'>
                  {item.itemCategory?.name ?? 'Sin categoría'}
               </Badge>
            </div>
            {item.deletedAt && (
               <div className='absolute bottom-3 left-3'>
                  <Badge variant='destructive' className='text-xs'>
                     Eliminado
                  </Badge>
               </div>
            )}
         </CardHeader>

         {/* Contenido de la card */}
         <CardContent className='flex-1 p-4 flex flex-col'>
            {/* Header con código y precio */}
            <div className='flex items-center justify-between mb-3'>
               <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-sm text-muted-foreground'>
                     <span className='font-mono font-medium'>{item.code}</span>
                  </Badge>
                  {/* Marca */}
                  {item.brand && (
                     <Badge variant='secondary' className='text-sm font-medium text-muted-foreground'>{item.brand}</Badge>
                  )}
               </div>
               <div className='flex items-center text-md font-medium text-green-600'>
                  <span>{formatPrice(item.price)}</span>
               </div>
            </div>

            {/* Nombre del producto */}
            <h3 className='text-lg font-semibold mb-2 line-clamp-2 leading-tight flex-1'>
               {item.name}
            </h3>

            {/* Descripción */}
            <p className='text-xs text-muted-foreground line-clamp-2 mb-3'>
               {item.description ?? 'Sin descripción'}
            </p>
         </CardContent>

         {/* Botones de acción */}
         <CardFooter className='p-4 pt-0 flex gap-2'>
            <Button onClick={handleShowItemInfo} className='flex-1 hover:cursor-pointer' variant='secondary'>
               <Eye className='w-4 h-4' />
               Ver Detalles
            </Button>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='icon' className='hover:cursor-pointer'>
                     <MoreVertical className='h-4 w-4' />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onEdit?.(item)}>
                     <Edit className='h-4 w-4' />
                     Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(item)} className='text-destructive'>
                     <Trash2 className='h-4 w-4 text-destructive' />
                     Eliminar
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </CardFooter>
      </Card>
   )
}

export default ItemCard