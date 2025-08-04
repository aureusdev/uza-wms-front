import React, { useRef } from 'react';
import { useUpload } from '../hooks/useUpload';
import { useImageOperationFeedback } from '../hooks/useImageOperationFeedback';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import ImageOperationFeedback from './ImageOperationFeedback';

interface ImageUploaderProps {
   type: 'avatar' | 'product';
   onUploadSuccess: (url: string) => void;
   accept?: string;
   maxSize?: number; // en MB
   className?: string;
}

function ImageUploader({
   type,
   onUploadSuccess,
   accept = 'image/*',
   maxSize = type === 'avatar' ? 5 : 10,
   className = ''
}: ImageUploaderProps) {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { uploading, uploadAvatar, uploadProductImage } = useUpload();
   const { 
      operationState, 
      showUploadingFeedback, 
      showSuccessFeedback, 
      showErrorFeedback,
      isOperationInProgress 
   } = useImageOperationFeedback();

   const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
         showErrorFeedback(`El archivo es demasiado grande. Máximo ${maxSize}MB permitido`);
         return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
         showErrorFeedback('Solo se permiten archivos de imagen (JPG, PNG, GIF, etc.)');
         return;
      }

      try {
         const fileTypeName = type === 'avatar' ? 'avatar' : 'imagen del producto';
         showUploadingFeedback(`Subiendo ${fileTypeName}...`);
         
         let url: string | null = null;

         if (type === 'avatar') {
            url = await uploadAvatar(file);
         } else {
            url = await uploadProductImage(file);
         }

         if (url) {
            showSuccessFeedback(`${type === 'avatar' ? 'Avatar' : 'Imagen del producto'} subida exitosamente`);
            onUploadSuccess(url);
         } else {
            showErrorFeedback(`Error al subir ${fileTypeName}. Inténtalo de nuevo`);
         }
      } catch (error) {
         console.error('Error uploading file:', error);
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
         showErrorFeedback(`Error inesperado: ${errorMessage}`);
      }

      // Limpiar el input
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const handleButtonClick = () => {
      fileInputRef.current?.click();
   };

   return (
      <div className={className}>
         <input
            ref={fileInputRef}
            type='file'
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
         />
         <Button
            type='button'
            variant='outline'
            onClick={handleButtonClick}
            disabled={uploading || isOperationInProgress}
            className='w-full'
         >
            {(uploading || isOperationInProgress) ? (
               <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Subiendo...
               </>
            ) : (
               <>
                  <Upload className='mr-2 h-4 w-4' />
                  Subir {type === 'avatar' ? 'Avatar' : 'Imagen'}
               </>
            )}
         </Button>
         
         {/* Enhanced visual feedback */}
         <div className="mt-2">
            {operationState === 'uploading' && (
               <ImageOperationFeedback 
                  operation="uploading" 
                  message={`Subiendo ${type === 'avatar' ? 'avatar' : 'imagen del producto'}...`}
               />
            )}
            {operationState === 'success' && (
               <ImageOperationFeedback 
                  operation="success" 
                  message={`${type === 'avatar' ? 'Avatar' : 'Imagen'} subida exitosamente`}
               />
            )}
            {operationState === 'error' && (
               <ImageOperationFeedback 
                  operation="error" 
                  message="Error al subir la imagen"
               />
            )}
         </div>
      </div>
   );
}

export default ImageUploader
