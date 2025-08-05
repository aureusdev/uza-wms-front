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
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import {
   Edit,
   Eye,
   MoreVertical,
   Trash2,
   Package,
   Calendar,
   Hash
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Container } from '../types/container.types'
import { ContainerStatus } from '../types/container.types'

interface ContainerCardProps {
   container: Container;
   onViewDetails?: (id: number) => void;
   onEdit?: (id: number) => void;
   onDelete?: (id: number) => void;
}

function ContainerCard({ container, onViewDetails, onEdit, onDelete }: ContainerCardProps) {

   const getStatusConfig = (status: ContainerStatus) => {
      switch (status) {
         case ContainerStatus.AVAILABLE:
            return {
               variant: 'default' as const,
               label: 'Disponible',
               color: 'bg-green-100 text-green-800 border-green-200'
            };
         case ContainerStatus.INACTIVE:
            return {
               variant: 'secondary' as const,
               label: 'Inactivo',
               color: 'bg-gray-100 text-gray-800 border-gray-200'
            };
         case ContainerStatus.IN_REVIEW:
            return {
               variant: 'outline' as const,
               label: 'En Revisión',
               color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
            };
         case ContainerStatus.ASSIGNED:
            return {
               variant: 'destructive' as const,
               label: 'Asignado',
               color: 'bg-blue-100 text-blue-800 border-blue-200'
            };
         default:
            return {
               variant: 'outline' as const,
               label: 'Desconocido',
               color: 'bg-gray-100 text-gray-800 border-gray-200'
            };
      }
   }

   const statusConfig = getStatusConfig(container.status)
   const isDeleted = !!container.deletedAt
   const itemCount = container.inventoryItems?.length || 0

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
         day: '2-digit',
         month: 'short',
         year: 'numeric'
      })
   }

   return (
      <Card className={`group overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full ${isDeleted ? 'opacity-60 bg-gray-50' : 'bg-white/80 backdrop-blur-sm'}`}>
         {/* Header con icono y estado */}
         <CardHeader className="relative pb-4">
            <div className="flex items-start justify-between">
               <div className="flex items-start gap-3 flex-1">
                  {/* Icono del contenedor */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDeleted ? 'bg-gray-200' : 'bg-primary/10'} transition-colors group-hover:scale-105`}>
                     <Package className={`h-6 w-6 ${isDeleted ? 'text-gray-500' : 'text-primary'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {container.name}
                     </CardTitle>
                     <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs font-mono">
                           <Hash className="h-3 w-3 mr-1" />
                           {container.code}
                        </Badge>
                        <Badge className={statusConfig.color}>
                           {statusConfig.label}
                        </Badge>
                     </div>
                  </div>
               </div>

               {/* Menú de acciones */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                     >
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
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
            </div>

            {/* Badge de eliminado */}
            {isDeleted && (
               <div className="absolute top-3 right-3">
                  <Badge variant="destructive" className="text-xs">
                     Eliminado
                  </Badge>
               </div>
            )}
         </CardHeader>

         {/* Contenido principal */}
         <CardContent className="flex-1 px-6 pb-4">
            {/* Descripción */}
            <div className="space-y-3">
               <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {container.description || 'Sin descripción disponible'}
               </p>

               <Separator />

               {/* Estadísticas del contenedor */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                     <div className="text-2xl font-bold text-primary">
                        {itemCount}
                     </div>
                     <div className="text-xs text-muted-foreground">
                        {itemCount === 1 ? 'Elemento' : 'Elementos'}
                     </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                     <div className="text-2xl font-bold text-primary">
                        #{container.id}
                     </div>
                     <div className="text-xs text-muted-foreground">
                        ID Sistema
                     </div>
                  </div>
               </div>

               {/* Información de fechas */}
               <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Creado:</span>
                     </div>
                     <span className="font-medium">{formatDate(container.createdAt)}</span>
                  </div>
                  {container.updatedAt !== container.createdAt && (
                     <div className="flex items-center justify-between">
                        <span className="ml-4">Actualizado:</span>
                        <span className="font-medium">{formatDate(container.updatedAt)}</span>
                     </div>
                  )}
                  {isDeleted && container.deletedAt && (
                     <div className="flex items-center justify-between text-destructive">
                        <span className="ml-4">Eliminado:</span>
                        <span className="font-medium">{formatDate(container.deletedAt)}</span>
                     </div>
                  )}
               </div>
            </div>
         </CardContent>

         {/* Footer con botón de acción */}
         <CardFooter className="pt-0 px-6 pb-6">
            <Button
               onClick={() => onViewDetails?.(container.id)}
               className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
               variant="secondary"
            >
               <Eye className="h-4 w-4 mr-2" />
               Ver Detalles
            </Button>
         </CardFooter>
      </Card>
   )
}

export default ContainerCard