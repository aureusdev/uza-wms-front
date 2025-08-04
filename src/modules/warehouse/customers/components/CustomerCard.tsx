import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
   DropdownMenu, 
   DropdownMenuContent, 
   DropdownMenuItem, 
   DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
   MoreVertical, 
   Edit, 
   Trash2, 
   RotateCcw,
   ExternalLink
} from "lucide-react";
import type { Customer } from '../types/customer.types';

interface CustomerCardProps {
   customer: Customer;
   onEdit?: (customer: Customer) => void;
   onDelete?: (customer: Customer) => void;
   onRestore?: (customer: Customer) => void;
   onHardDelete?: (customer: Customer) => void;
}

export function CustomerCard({ 
   customer, 
   onEdit, 
   onDelete, 
   onRestore, 
   onHardDelete 
}: CustomerCardProps) {
   const isDeleted = !!customer.deletedAt;

   return (
      <Card className={`group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-sm ${isDeleted ? 'opacity-60' : ''}`}>
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
               <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                     </div>
                     <div>
                        <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                           {customer.firstName} {customer.lastName}
                        </CardTitle>
                        {customer.externalId && (
                           <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              ID: {customer.externalId}
                           </Badge>
                        )}
                     </div>
                  </div>
                  
                  {isDeleted && (
                     <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                        Eliminado
                     </Badge>
                  )}
               </div>
               
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {!isDeleted ? (
                        <>
                           <DropdownMenuItem onClick={() => onEdit?.(customer)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                              onClick={() => onDelete?.(customer)}
                              className="text-red-600"
                           >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                           </DropdownMenuItem>
                        </>
                     ) : (
                        <>
                           <DropdownMenuItem onClick={() => onRestore?.(customer)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restaurar
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                              onClick={() => onHardDelete?.(customer)}
                              className="text-red-600"
                           >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar permanentemente
                           </DropdownMenuItem>
                        </>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardHeader>
         
         <CardContent className="pt-0">
            <div className="space-y-2 text-xs text-slate-500">
               <div className="flex items-center justify-between">
                  <span>Creado:</span>
                  <span className="font-medium">{new Date(customer.createdAt).toLocaleDateString('es-ES')}</span>
               </div>
               {customer.updatedAt !== customer.createdAt && (
                  <div className="flex items-center justify-between">
                     <span>Actualizado:</span>
                     <span className="font-medium">{new Date(customer.updatedAt).toLocaleDateString('es-ES')}</span>
                  </div>
               )}
               {isDeleted && (
                  <div className="flex items-center justify-between text-red-600">
                     <span>Eliminado:</span>
                     <span className="font-medium">{new Date(customer.deletedAt!).toLocaleDateString('es-ES')}</span>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}