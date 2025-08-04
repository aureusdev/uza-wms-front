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
   MoreVertical,
   Trash2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Container } from '../types/container.types'
import { ContainerStatus } from '../types/container.types'

interface ContainerCardProps {
   container: Container;
   onViewDetails?: (id: number) => void;
   onEdit?: (id: number) => void;
   onDelete?: (id: number) => void;
}

function ContainerCard({ container, onViewDetails, onEdit, onDelete }: ContainerCardProps) {

   const getStatusVariant = (status: ContainerStatus) => {
      switch (status) {
         case ContainerStatus.AVAILABLE:
            return 'default';
         case ContainerStatus.INACTIVE:
            return 'secondary';
         case ContainerStatus.IN_REVIEW:
            return 'outline';
         case ContainerStatus.ASSIGNED:
            return 'destructive';
         default:
            return 'outline';
      }
   }

   const getStatusLabel = (status: ContainerStatus) => {
      switch (status) {
         case ContainerStatus.AVAILABLE:
            return 'Disponible';
         case ContainerStatus.INACTIVE:
            return 'Inactivo';
         case ContainerStatus.IN_REVIEW:
            return 'En revisión';
         case ContainerStatus.ASSIGNED:
            return 'Asignado';
         default:
            return 'Desconocido';
      }
   }

   return (
      <Card className="w-full hover:-translate-y-1 transition-all hover:shadow-lg">
         <CardHeader>
            <div className="flex items-start justify-between">
               <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{container.name}</CardTitle>
                  <CardDescription className="mt-1">{container.description || 'Sin descripción'}</CardDescription>
               </div>
               <div className="flex items-center gap-2 ml-4">
                  <Badge variant={getStatusVariant(container.status)}>
                     {getStatusLabel(container.status)}
                  </Badge>
                  {container.deletedAt && (
                     <Badge variant="destructive">Eliminado</Badge>
                  )}
                  <Badge variant="secondary">{container.code}</Badge>
               </div>
            </div>
         </CardHeader>

         <CardContent>
            <div>
               {container.description}
               {container.inventoryItems?.length}
            </div>
         </CardContent>

         <CardFooter className='pt-0 flex gap-2'>
            <Button
               variant="secondary"
               className="w-full flex-1 hover:cursor-pointer"
               onClick={() => onViewDetails?.(container.id)}
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
                     onClick={() => onEdit?.(container.id)}
                     className="cursor-pointer"
                  >
                     <Edit className="mr-2 h-4 w-4" />
                     Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => onDelete?.(container.id)}
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

export default ContainerCard
