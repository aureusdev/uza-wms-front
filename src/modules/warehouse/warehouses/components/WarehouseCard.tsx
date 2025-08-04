import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import {
   Edit,
   Eye,
   MapPin,
   MoreVertical,
   Trash2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Warehouse } from '../types/warehouse.types'

interface WarehouseCardProps {
   warehouse: Warehouse;
   onViewDetails?: (id: number) => void;
   onEdit?: (id: number) => void;
   onDelete?: (id: number) => void;
}

function WarehouseCard({ warehouse, onViewDetails, onEdit, onDelete }: WarehouseCardProps) {

   const getWarehouseType = () => {
      switch (warehouse.type) {
         case 'MAIN':
            return 'PRINCIPAL';
         case 'AUXILIAR':
            return 'AUXILIAR';
         case 'SITE':
            return 'SITIO';
         default:
            return 'Desconocido';
      }
   }

   return (
      <Card className="w-full hover:-translate-y-1 transition-all hover:shadow-lg">
         <CardHeader>
            <div className="flex items-start justify-between">
               <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{warehouse.name}</CardTitle>
                  <CardDescription className="mt-1">{warehouse.description}</CardDescription>
               </div>
               <div className="flex items-center gap-2 ml-4">
                  <Badge variant={warehouse.type === 'MAIN' ? 'default' : 'secondary'}>
                     {getWarehouseType()}
                  </Badge>
                  <Badge variant={warehouse.isActive ? 'secondary' : 'destructive'}>
                     {warehouse.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
               </div>
            </div>
         </CardHeader>

         <CardContent>
            <div className="flex items-start gap-2">
               <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
               <p className="text-sm text-muted-foreground">{warehouse.location}</p>
            </div>
         </CardContent>

         <CardFooter className='pt-0 flex gap-2'>
            <Button
               variant="secondary"
               className="w-full flex-1 hover:cursor-pointer"
               onClick={() => onViewDetails?.(warehouse.id)}
            >
               <Eye className="h-4 w-4" />
               Ver Detalles
            </Button>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hover:cursor-pointer">
                     <MoreVertical className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[160px] bg-popover">
                  <DropdownMenuItem
                     onClick={() => onEdit?.(warehouse.id)}
                     className="cursor-pointer"
                  >
                     <Edit className="mr-2 h-4 w-4" />
                     Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => onDelete?.(warehouse.id)}
                     className="cursor-pointer text-destructive focus:text-destructive"
                  >
                     <Trash2 className="mr-2 h-4 w-4" />
                     Eliminar
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </CardFooter>
      </Card>
   )
}

export default WarehouseCard