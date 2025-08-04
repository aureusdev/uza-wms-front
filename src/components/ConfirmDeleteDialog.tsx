import React from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface ConfirmDeleteDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   title?: string;
   description?: string;
   confirmText?: string;
   cancelText?: string;
   isLoading?: boolean;
   trigger?: React.ReactNode;
   disabled?: boolean;
}

/**
 * Diálogo de confirmación reutilizable para operaciones de eliminación
 * @param props - Propiedades del diálogo
 * @returns Componente de diálogo de confirmación
 */
export function ConfirmDeleteDialog({
   open,
   onOpenChange,
   onConfirm,
   title = '¿Estás seguro?',
   description = 'Esta acción no se puede deshacer.',
   confirmText = 'Eliminar',
   cancelText = 'Cancelar',
   isLoading = false,
   trigger,
   disabled = false,
}: ConfirmDeleteDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{title}</AlertDialogTitle>
               <AlertDialogDescription>
                  {description}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isLoading}>
                  {cancelText}
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={onConfirm}
                  disabled={isLoading || disabled}
                  className="bg-destructive hover:bg-destructive"
               >
                  {isLoading ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Eliminando...
                     </>
                  ) : (
                     <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {confirmText}
                     </>
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

export default ConfirmDeleteDialog;
