import { useState, useCallback } from 'react';
import { ImageService } from '../services/imageService';
import type { FileReference } from '../types/upload.types';

interface UseImageReferencesReturn {
   loading: boolean;
   references: FileReference[];
   checkReferences: (imageUrl: string) => Promise<FileReference[]>;
   hasReferences: boolean;
   getReferenceCount: () => number;
   getReferenceSummary: () => string;
   canDelete: (isAdmin?: boolean) => boolean;
   clearReferences: () => void;
}

/**
 * Hook para manejar el chequeo de referencias de imágenes antes de eliminación
 * Proporciona funcionalidades para verificar si una imagen está siendo utilizada
 * y determinar si se puede eliminar de forma segura
 */
export function useImageReferences(): UseImageReferencesReturn {
   const [loading, setLoading] = useState(false);
   const [references, setReferences] = useState<FileReference[]>([]);

   /**
    * Verifica las referencias de una imagen
    * @param imageUrl - URL de la imagen a verificar
    * @returns Promise<FileReference[]> - Lista de referencias encontradas
    */
   const checkReferences = useCallback(async (imageUrl: string): Promise<FileReference[]> => {
      setLoading(true);

      try {
         const imageInfo = await ImageService.getImageInfo(imageUrl);
         const foundReferences = imageInfo.references || [];
         setReferences(foundReferences);
         return foundReferences;
      } catch (error) {
         console.error('Error checking image references:', error);
         setReferences([]);
         return [];
      } finally {
         setLoading(false);
      }
   }, []);

   /**
    * Determina si la imagen tiene referencias
    */
   const hasReferences = references.length > 0;

   /**
    * Obtiene el número total de referencias
    */
   const getReferenceCount = useCallback(() => references.length, [references]);

   /**
    * Genera un resumen legible de las referencias
    */
   const getReferenceSummary = useCallback(() => {
      if (references.length === 0) {
         return 'Sin referencias encontradas';
      }

      const entityTypes = references.reduce((acc, ref) => {
         const type = ref.entityType === 'item' ? 'productos' :
            ref.entityType === 'user' ? 'usuarios' : 'categorías';
         acc[type] = (acc[type] || 0) + 1;
         return acc;
      }, {} as Record<string, number>);

      const summary = Object.entries(entityTypes)
         .map(([type, count]) => `${count} ${type}`)
         .join(', ');

      return `Utilizada por: ${summary}`;
   }, [references]);

   /**
    * Determina si se puede eliminar la imagen
    * @param isAdmin - Si el usuario actual es administrador
    * @returns boolean - Si se puede eliminar la imagen
    */
   const canDelete = useCallback((isAdmin = false) => {
      // Si no hay referencias, siempre se puede eliminar
      if (!hasReferences) return true;

      // Si es admin, puede eliminar con override
      if (isAdmin) return true;

      // Si hay referencias y no es admin, no se puede eliminar
      return false;
   }, [hasReferences]);

   /**
    * Limpia las referencias almacenadas
    */
   const clearReferences = useCallback(() => {
      setReferences([]);
   }, []);

   return {
      loading,
      references,
      checkReferences,
      hasReferences,
      getReferenceCount,
      getReferenceSummary,
      canDelete,
      clearReferences,
   };
}
