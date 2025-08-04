import React from 'react';
import { X, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

interface ImagePreviewProps {
   imageUrl?: string;
   previewUrl?: string;
   altText?: string;
   onDelete?: () => void;
   deleting?: boolean;
   checkingReferences?: boolean;
   hasReferences?: boolean;
   isAdmin?: boolean;
   canDelete?: boolean;
   onConfirmDelete?: () => void;
   deleteDialogTitle?: string;
   deleteDialogDescription?: string;
   className?: string;
}

/**
 * Componente de previsualización de imagen reutilizable
 * @param props - Propiedades del componente
 * @returns Componente de preview de imagen
 */
export function ImagePreview({
   imageUrl,
   previewUrl,
   altText = 'Previsualización',
   onDelete,
   deleting = false,
   checkingReferences = false,
   hasReferences = false,
   isAdmin = false,
   canDelete = false,
   onConfirmDelete,
   deleteDialogTitle = '¿Eliminar imagen?',
   deleteDialogDescription = 'Esta acción eliminará la imagen.',
   className = '',
}: ImagePreviewProps) {
   const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

   const handleDelete = () => {
      if (onConfirmDelete) {
         onConfirmDelete();
      } else if (onDelete) {
         onDelete();
      }
      setShowDeleteDialog(false);
   };

   const currentImageUrl = previewUrl || imageUrl;

   if (!currentImageUrl) {
      return (
         <div className={`flex flex-col items-center justify-center h-full text-muted-foreground ${className}`}>
            <Package className="h-12 w-12 mb-2 text-muted-foreground" />
            <p className="text-sm text-center">
               Sin imagen
            </p>
            <p className="text-xs text-center text-muted-foreground">
               Sube una imagen
            </p>
         </div>
      );
   }

   return (
      <div className={`relative w-full h-full ${className}`}>
         <img
            src={currentImageUrl || "/placeholder.png"}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => {
               e.currentTarget.src = "/placeholder.png";
            }}
         />

         {/* Botón de eliminar */}
         <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting || checkingReferences}
         >
            {deleting || checkingReferences ? (
               <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
               <X className="h-4 w-4" />
            )}
         </Button>

         {/* Diálogo de confirmación */}
         <ConfirmDeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDelete}
            title={deleteDialogTitle}
            description={deleteDialogDescription}
            confirmText={hasReferences && isAdmin ? 'Eliminar (Override)' : 'Eliminar'}
            disabled={hasReferences && !canDelete}
            isLoading={deleting || checkingReferences}
         />
      </div>
   );
}

export default ImagePreview;
