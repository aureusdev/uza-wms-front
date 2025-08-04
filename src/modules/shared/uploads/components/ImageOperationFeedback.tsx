import { Loader2, CheckCircle, XCircle, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OperationType = 'uploading' | 'deleting' | 'success' | 'error' | 'idle';

interface ImageOperationFeedbackProps {
   operation: OperationType;
   message?: string;
   className?: string;
   variant?: 'default' | 'compact' | 'detailed';
}

const operationConfig = {
   uploading: {
      icon: Upload,
      loadingIcon: Loader2,
      text: 'Subiendo imagen...',
      className: 'text-blue-600 bg-blue-50 border-blue-200',
      animate: true,
   },
   deleting: {
      icon: Trash2,
      loadingIcon: Loader2,
      text: 'Eliminando imagen...',
      className: 'text-red-600 bg-red-50 border-red-200',
      animate: true,
   },
   success: {
      icon: CheckCircle,
      loadingIcon: CheckCircle,
      text: 'Operación completada',
      className: 'text-green-600 bg-green-50 border-green-200',
      animate: false,
   },
   error: {
      icon: XCircle,
      loadingIcon: XCircle,
      text: 'Error en la operación',
      className: 'text-red-600 bg-red-50 border-red-200',
      animate: false,
   },
   idle: {
      icon: AlertCircle,
      loadingIcon: AlertCircle,
      text: '',
      className: 'text-gray-400 bg-gray-50 border-gray-200',
      animate: false,
   },
};

/**
 * Component that provides consistent visual feedback for image operations
 * Used across all image-related components to ensure uniform UX
 * Enhanced with multiple variants and better visual design
 */
export function ImageOperationFeedback({ 
   operation, 
   message, 
   className,
   variant = 'default'
}: ImageOperationFeedbackProps) {
   if (operation === 'idle') return null;

   const config = operationConfig[operation];
   const Icon = config.animate ? config.loadingIcon : config.icon;
   const displayMessage = message || config.text;

   if (variant === 'compact') {
      return (
         <div className={cn(
            "flex items-center text-sm",
            config.className.split(' ')[0], // Solo el color del texto
            className
         )}>
            <Icon 
               className={cn(
                  "h-4 w-4 mr-2",
                  config.animate && "animate-spin"
               )} 
            />
            <span>{displayMessage}</span>
         </div>
      );
   }

   if (variant === 'detailed') {
      return (
         <div className={cn(
            "flex items-center justify-center p-3 rounded-lg border text-sm font-medium",
            config.className,
            className
         )}>
            <Icon 
               className={cn(
                  "h-5 w-5 mr-3",
                  config.animate && "animate-spin"
               )} 
            />
            <div className="flex flex-col">
               <span>{displayMessage}</span>
               {operation === 'uploading' && (
                  <span className="text-xs opacity-75 mt-1">
                     Procesando archivo...
                  </span>
               )}
               {operation === 'deleting' && (
                  <span className="text-xs opacity-75 mt-1">
                     Verificando referencias...
                  </span>
               )}
            </div>
         </div>
      );
   }

   // Default variant
   return (
      <div className={cn(
         "flex items-center justify-center text-sm p-2 rounded-md border",
         config.className,
         className
      )}>
         <Icon 
            className={cn(
               "h-4 w-4 mr-2",
               config.animate && "animate-spin"
            )} 
         />
         <span>{displayMessage}</span>
      </div>
   );
}

export default ImageOperationFeedback;