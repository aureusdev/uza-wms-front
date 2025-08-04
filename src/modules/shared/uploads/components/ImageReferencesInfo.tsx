import { AlertTriangle, Users, Package, FolderOpen, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { FileReference } from '../types/upload.types';

interface ImageReferencesInfoProps {
   references: FileReference[];
   loading?: boolean;
   className?: string;
   showDetails?: boolean;
   isAdmin?: boolean;
}

const entityConfig = {
   user: {
      icon: Users,
      label: 'Usuario',
      labelPlural: 'Usuarios',
      color: 'bg-blue-100 text-blue-800',
   },
   item: {
      icon: Package,
      label: 'Producto',
      labelPlural: 'Productos',
      color: 'bg-green-100 text-green-800',
   },
   category: {
      icon: FolderOpen,
      label: 'Categoría',
      labelPlural: 'Categorías',
      color: 'bg-purple-100 text-purple-800',
   },
};

/**
 * Componente que muestra información detallada sobre las referencias de una imagen
 * Incluye advertencias visuales, conteo por tipo de entidad y opciones para admin
 */
export function ImageReferencesInfo({
   references,
   loading = false,
   className,
   showDetails = true,
   isAdmin = false
}: ImageReferencesInfoProps) {
   if (loading) {
      return (
         <div className={cn("flex items-center justify-center p-4", className)}>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Verificando referencias...</span>
         </div>
      );
   }

   if (references.length === 0) {
      return (
         <div className={cn("text-center p-4", className)}>
            <div className="flex items-center justify-center mb-2">
               <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
               </div>
            </div>
            <p className="text-sm text-gray-600">
               Esta imagen no está siendo utilizada por ninguna entidad.
            </p>
            <p className="text-xs text-gray-500 mt-1">
               Es seguro eliminarla.
            </p>
         </div>
      );
   }

   // Agrupar referencias por tipo de entidad
   const groupedReferences = references.reduce((acc, ref) => {
      if (!acc[ref.entityType]) {
         acc[ref.entityType] = [];
      }
      acc[ref.entityType].push(ref);
      return acc;
   }, {} as Record<string, FileReference[]>);

   const totalReferences = references.length;
   const entityTypes = Object.keys(groupedReferences) as Array<keyof typeof entityConfig>;

   return (
      <div className={cn("space-y-4", className)}>
         {/* Alerta principal */}
         <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
               <div className="flex items-center justify-between">
                  <div>
                     <strong>Imagen en uso</strong>
                     <p className="text-sm mt-1">
                        Esta imagen está siendo utilizada por {totalReferences} entidad{totalReferences > 1 ? 'es' : ''}.
                        {!isAdmin && ' No se puede eliminar mientras esté en uso.'}
                     </p>
                  </div>
                  {isAdmin && (
                     <div className="flex items-center ml-4">
                        <Shield className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-xs text-blue-600 font-medium">Admin Override</span>
                     </div>
                  )}
               </div>
            </AlertDescription>
         </Alert>

         {/* Resumen por tipo de entidad */}
         <div className="flex flex-wrap gap-2">
            {entityTypes.map((entityType) => {
               const config = entityConfig[entityType];
               const count = groupedReferences[entityType].length;
               const Icon = config.icon;

               return (
                  <Badge
                     key={entityType}
                     variant="secondary"
                     className={cn("flex items-center gap-1", config.color)}
                  >
                     <Icon className="h-3 w-3" />
                     {count} {count === 1 ? config.label : config.labelPlural}
                  </Badge>
               );
            })}
         </div>

         {/* Detalles de referencias (opcional) */}
         {showDetails && (
            <div className="space-y-3">
               <h4 className="text-sm font-medium text-gray-900">
                  Referencias detalladas:
               </h4>
               <div className="space-y-2 max-h-32 overflow-y-auto">
                  {entityTypes.map((entityType) => {
                     const config = entityConfig[entityType];
                     const entityRefs = groupedReferences[entityType];
                     const Icon = config.icon;

                     return (
                        <div key={entityType} className="space-y-1">
                           <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                              <Icon className="h-3 w-3" />
                              {config.labelPlural}:
                           </div>
                           <div className="ml-5 space-y-1">
                              {entityRefs.map((ref, index) => (
                                 <div key={`${ref.entityType}-${ref.entityId}-${index}`} 
                                      className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                    ID: {ref.entityId} • Campo: {ref.fieldName}
                                    {ref.createdAt && (
                                       <span className="text-gray-500 ml-2">
                                          • {new Date(ref.createdAt).toLocaleDateString()}
                                       </span>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}

         {/* Mensaje para admin */}
         {isAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
               <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                     <p className="text-blue-800 font-medium">Privilegios de administrador</p>
                     <p className="text-blue-700 text-xs mt-1">
                        Como administrador, puedes eliminar esta imagen aunque esté en uso. 
                        Las entidades que la referencian mostrarán una imagen placeholder.
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default ImageReferencesInfo;
