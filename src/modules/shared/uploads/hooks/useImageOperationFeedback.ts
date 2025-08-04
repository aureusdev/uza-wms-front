import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type ImageOperationState = 'idle' | 'uploading' | 'deleting' | 'success' | 'error';

interface UseImageOperationFeedbackReturn {
   operationState: ImageOperationState;
   setOperationState: (state: ImageOperationState) => void;
   showUploadingFeedback: (message?: string) => void;
   showDeletingFeedback: (message?: string) => void;
   showSuccessFeedback: (message?: string) => void;
   showErrorFeedback: (message?: string) => void;
   showValidationErrorFeedback: (message?: string) => void;
   showNetworkErrorFeedback: (message?: string) => void;
   resetFeedback: () => void;
   isOperationInProgress: boolean;
}

/**
 * Hook that provides consistent visual feedback for image operations
 * Manages both toast notifications and component state for loading indicators
 * Enhanced with specific error types and better UX messaging
 */
export function useImageOperationFeedback(): UseImageOperationFeedbackReturn {
   const [operationState, setOperationState] = useState<ImageOperationState>('idle');

   const showUploadingFeedback = useCallback((message = 'Subiendo imagen...') => {
      setOperationState('uploading');
      toast.loading(message, { 
         id: 'image-operation',
         description: 'Por favor espera mientras se procesa la imagen'
      });
   }, []);

   const showDeletingFeedback = useCallback((message = 'Eliminando imagen...') => {
      setOperationState('deleting');
      toast.loading(message, { 
         id: 'image-operation',
         description: 'Verificando referencias y eliminando archivo'
      });
   }, []);

   const showSuccessFeedback = useCallback((message = 'Operación completada exitosamente') => {
      setOperationState('success');
      toast.success(message, { 
         id: 'image-operation',
         description: 'La operación se completó sin errores'
      });
      
      // Auto-reset after showing success
      setTimeout(() => {
         setOperationState('idle');
      }, 2000);
   }, []);

   const showErrorFeedback = useCallback((message = 'Error en la operación') => {
      setOperationState('error');
      toast.error(message, { 
         id: 'image-operation',
         description: 'Revisa los detalles e inténtalo de nuevo'
      });
      
      // Auto-reset after showing error
      setTimeout(() => {
         setOperationState('idle');
      }, 4000);
   }, []);

   const showValidationErrorFeedback = useCallback((message = 'Error de validación') => {
      setOperationState('error');
      toast.error(message, { 
         id: 'image-operation',
         description: 'Verifica que el archivo cumpla con los requisitos'
      });
      
      // Auto-reset after showing validation error
      setTimeout(() => {
         setOperationState('idle');
      }, 4000);
   }, []);

   const showNetworkErrorFeedback = useCallback((message = 'Error de conexión') => {
      setOperationState('error');
      toast.error(message, { 
         id: 'image-operation',
         description: 'Verifica tu conexión a internet e inténtalo de nuevo',
         action: {
            label: 'Reintentar',
            onClick: () => {
               setOperationState('idle');
               toast.dismiss('image-operation');
            }
         }
      });
      
      // Auto-reset after showing network error (longer timeout)
      setTimeout(() => {
         setOperationState('idle');
      }, 6000);
   }, []);

   const resetFeedback = useCallback(() => {
      setOperationState('idle');
      toast.dismiss('image-operation');
   }, []);

   const isOperationInProgress = operationState === 'uploading' || operationState === 'deleting';

   return {
      operationState,
      setOperationState,
      showUploadingFeedback,
      showDeletingFeedback,
      showSuccessFeedback,
      showErrorFeedback,
      showValidationErrorFeedback,
      showNetworkErrorFeedback,
      resetFeedback,
      isOperationInProgress,
   };
}

export default useImageOperationFeedback;