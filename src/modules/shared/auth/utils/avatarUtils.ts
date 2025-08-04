/**
 * Utilidades para manejo de avatares
 */

/**
 * Genera las iniciales de un nombre para usar como avatar fallback
 */
export const getInitials = (name: string): string => {
   if (!name) return '';

   const words = name.trim().split(' ').filter(word => word.length > 0);

   if (words.length === 0) return '';
   if (words.length === 1) return words[0].charAt(0).toUpperCase();

   // Tomar primera letra del primer nombre y primera letra del último apellido
   const firstInitial = words[0].charAt(0);
   const lastInitial = words[words.length - 1].charAt(0);

   return (firstInitial + lastInitial).toUpperCase();
};

/**
 * Genera un color de fondo basado en el nombre para avatares consistentes
 */
export const getAvatarColor = (name: string): string => {
   if (!name) return 'bg-slate-200';

   const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-yellow-100 text-yellow-700',
      'bg-red-100 text-red-700',
      'bg-teal-100 text-teal-700',
   ];

   // Usar el código de caracteres para generar un índice consistente
   const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
   return colors[hash % colors.length];
};

/**
 * Verifica si una URL de imagen es válida y accesible
 */
export const isValidImageUrl = (url: string): boolean => {
   if (!url) return false;

   // Verificar si es base64
   if (url.startsWith('data:image/')) return true;

   // Verificar si es una URL HTTP/HTTPS válida
   try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
   } catch {
      return false;
   }
};