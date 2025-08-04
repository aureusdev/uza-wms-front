import { useState } from 'react';
import { toast } from 'sonner';
import { buildApiUrl } from '../../../../config/api.config';
import { TokenService } from '../../auth/services/tokenService';
import { ImageService } from '../services/imageService';
import type { 
   UploadResponse, 
   UploadError, 
   UseUploadReturn,
   ImageInfo,
   ImageListResponse 
} from '../types/upload.types';

/**
 * Hook para manejar la subida y gestión de archivos
 * Incluye funcionalidades de upload, delete, info y listado de imágenes
 */
export function useUpload(): UseUploadReturn {
   const [uploading, setUploading] = useState(false);
   const [deleting, setDeleting] = useState(false);

   const uploadFile = async (file: File, endpoint: 'avatar' | 'product-image'): Promise<string | null> => {
      setUploading(true);

      try {
         const formData = new FormData();
         formData.append('file', file);

         const response = await fetch(buildApiUrl(`/uploads/${endpoint}`), {
            method: 'POST',
            body: formData,
            headers: {
               // No establecer Content-Type, el browser lo hará automáticamente para FormData
               'Authorization': `Bearer ${TokenService.getAccessToken()}`,
            },
         });

         if (!response.ok) {
            const errorData: UploadError = await response.json();
            throw new Error(errorData.message || 'Error al subir archivo');
         }

         const data: UploadResponse = await response.json();
         // Note: Success toast is now handled in ImageUploader component for better UX
         return data.url;

      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir archivo';
         // Note: Error toast is now handled in ImageUploader component for better UX
         throw new Error(errorMessage);
      } finally {
         setUploading(false);
      }
   };

   const uploadAvatar = async (file: File): Promise<string | null> => {
      return uploadFile(file, 'avatar');
   };

   const uploadProductImage = async (file: File): Promise<string | null> => {
      return uploadFile(file, 'product-image');
   };

   /**
    * Elimina una imagen del servidor
    * @param imageUrl - URL de la imagen a eliminar
    * @param type - Tipo de imagen ('avatar' | 'product')
    * @returns Promise<boolean> - true si se eliminó exitosamente
    */
   const deleteImage = async (imageUrl: string, type: 'avatar' | 'product'): Promise<boolean> => {
      setDeleting(true);

      try {
         const response = await ImageService.deleteImage(imageUrl, type);
         
         if (response.success) {
            // Note: Success toast is now handled in the calling component for better UX
            return true;
         } else {
            // Show specific error message if image is referenced by other entities
            if (response.referencesFound && response.referencesFound.length > 0) {
               const entityTypes = response.referencesFound.map(ref => ref.entityType).join(', ');
               toast.error(`No se puede eliminar la imagen. Está siendo utilizada por: ${entityTypes}`);
            } else {
               toast.error(response.message || 'Error al eliminar la imagen');
            }
            return false;
         }

      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar imagen';
         // Note: Error toast is now handled in the calling component for better UX
         throw new Error(errorMessage);
      } finally {
         setDeleting(false);
      }
   };

   /**
    * Obtiene información detallada de una imagen
    * @param imageUrl - URL de la imagen
    * @returns Promise<ImageInfo | null> - Información de la imagen o null si hay error
    */
   const getImageInfo = async (imageUrl: string): Promise<ImageInfo | null> => {
      try {
         const imageInfo = await ImageService.getImageInfo(imageUrl);
         return imageInfo;

      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener información de imagen';
         toast.error(errorMessage);
         return null;
      }
   };

   /**
    * Lista imágenes con paginación
    * @param type - Tipo de imágenes a listar ('avatar' | 'product')
    * @param page - Número de página (opcional, por defecto 1)
    * @returns Promise<ImageListResponse | null> - Lista de imágenes o null si hay error
    */
   const listImages = async (type: 'avatar' | 'product', page?: number): Promise<ImageListResponse | null> => {
      try {
         const options = page ? { page } : {};
         const imageList = await ImageService.listImages(type, options);
         return imageList;

      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : 'Error desconocido al listar imágenes';
         toast.error(errorMessage);
         return null;
      }
   };

   return {
      // Existing functionality (backward compatibility)
      uploading,
      uploadAvatar,
      uploadProductImage,
      
      // New functionality
      deleting,
      deleteImage,
      getImageInfo,
      listImages,
   };
}