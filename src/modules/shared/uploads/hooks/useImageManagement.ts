import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ImageService } from '../services/imageService';
import type { 
  ImageInfo, 
  ReferenceInfo, 
  UseImageManagementReturn,
  PaginationOptions 
} from '../types/upload.types';

/**
 * Hook para gestión avanzada de imágenes
 * Proporciona funcionalidades para operaciones en lote, verificación de referencias
 * y gestión de estado para listas de imágenes
 */
export function useImageManagement(
  initialType: 'avatar' | 'product' = 'product',
  initialOptions: PaginationOptions = {}
): UseImageManagementReturn {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Internal state for current type and options
  const [currentType] = useState(initialType);
  const [currentOptions] = useState({ page: 1, limit: 10, ...initialOptions });

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Sets error state with message
   */
  const setErrorState = useCallback((errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  /**
   * Refreshes the image list from the server
   */
  const refreshImages = useCallback(async (): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      const response = await ImageService.listImages(currentType, currentOptions);
      setImages(response.images);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al cargar imágenes';
      setErrorState(errorMessage);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [currentType, currentOptions, clearError, setErrorState]);

  /**
   * Deletes multiple images in batch
   * @param imageUrls - Array of image URLs to delete
   * @returns Promise<boolean> - true if all deletions were successful
   */
  const deleteMultipleImages = useCallback(async (imageUrls: string[]): Promise<boolean> => {
    if (imageUrls.length === 0) {
      toast.warning('No hay imágenes seleccionadas para eliminar');
      return false;
    }

    setLoading(true);
    clearError();

    try {
      const results = await ImageService.deleteMultipleImages(imageUrls);
      
      // Handle results
      const { success, failed } = results;
      
      if (success.length > 0) {
        toast.success(`${success.length} imagen(es) eliminada(s) exitosamente`);
        
        // Remove successfully deleted images from local state
        setImages(prevImages => 
          prevImages.filter(img => !success.includes(img.url))
        );
      }

      if (failed.length > 0) {
        const errorMessage = `${failed.length} imagen(es) no pudieron ser eliminadas`;
        setErrorState(errorMessage);
        
        // Show details of failed deletions
        failed.forEach(failure => {
          toast.error(`Error eliminando ${failure.url}: ${failure.error}`);
        });
      }

      // Return true only if all deletions were successful
      return failed.length === 0;

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al eliminar imágenes';
      setErrorState(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearError, setErrorState]);

  /**
   * Gets reference information for a specific image
   * @param imageUrl - URL of the image to check references for
   * @returns Promise<ReferenceInfo[]> - Array of references or empty array if error
   */
  const getImageReferences = useCallback(async (imageUrl: string): Promise<ReferenceInfo[]> => {
    clearError();

    try {
      const references = await ImageService.checkReferences(imageUrl);
      return references;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al verificar referencias';
      setErrorState(errorMessage);
      return [];
    }
  }, [clearError, setErrorState]);

  return {
    images,
    loading,
    error,
    refreshImages,
    deleteMultipleImages,
    getImageReferences,
  };
}