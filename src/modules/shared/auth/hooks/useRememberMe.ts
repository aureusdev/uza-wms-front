import { useState, useEffect } from 'react';
import type { User, AuthCredential } from '../types/auth.types';

interface RememberedUser {
   name: string;
   username: string;
   avatar?: string;
   userId: number;
}

const REMEMBER_ME_KEY = 'rememberedUser';

export function useRememberMe() {
   const [rememberMe, setRememberMe] = useState(false);
   const [rememberedUser, setRememberedUser] = useState<RememberedUser | null>(null);

   // Cargar usuario recordado al inicializar
   useEffect(() => {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (stored) {
         try {
            const user = JSON.parse(stored);

            // Limpiar blob URLs inválidos
            if (user.avatar && user.avatar.startsWith('blob:')) {
               console.warn('Removing invalid blob URL from remembered user');
               user.avatar = undefined;
               localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(user));
            }

            setRememberedUser(user);
         } catch (error) {
            console.error('Error parsing remembered user:', error);
            localStorage.removeItem(REMEMBER_ME_KEY);
         }
      }
   }, []);

   const saveUser = (user: RememberedUser) => {
      localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(user));
      setRememberedUser(user);
   };

   const clearUser = () => {
      localStorage.removeItem(REMEMBER_ME_KEY);
      setRememberedUser(null);
      setRememberMe(false);
   };

   const handleRememberMeChange = (checked: boolean, user?: RememberedUser) => {
      setRememberMe(checked);
      if (checked && user) {
         saveUser(user);
      } else if (!checked) {
         clearUser();
      }
   };

   // Función helper para convertir blob URL a base64
   const convertBlobToBase64 = async (blobUrl: string): Promise<string | null> => {
      try {
         const response = await fetch(blobUrl);
         const blob = await response.blob();

         return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
         });
      } catch (error) {
         console.error('Error converting blob to base64:', error);
         return null;
      }
   };

   // Función helper para validar si una URL de imagen es válida
   const isValidImageUrl = (url: string): boolean => {
      // Verificar si es una URL HTTP/HTTPS válida (no blob)
      try {
         const urlObj = new URL(url);
         return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch {
         // Si no es una URL válida, verificar si es base64
         return url.startsWith('data:image/');
      }
   };

   // Función helper para crear RememberedUser desde los datos del login
   const createRememberedUserFromAuth = async (user: User, authCredential: AuthCredential): Promise<RememberedUser> => {
      const fullName = `${user.firstName} ${user.lastName}`.trim();

      let avatarUrl: string | undefined = user.profile?.avatarUrl;

      // Si la imagen es un blob URL, convertirla a base64 para persistencia
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
         const base64Avatar = await convertBlobToBase64(avatarUrl);
         avatarUrl = base64Avatar || undefined;
      }
      // Si no es una URL válida, no guardar avatar
      else if (avatarUrl && !isValidImageUrl(avatarUrl)) {
         avatarUrl = undefined;
      }

      return {
         name: fullName || authCredential.username,
         username: authCredential.username,
         avatar: avatarUrl,
         userId: user.id,
      };
   };

   return {
      rememberMe,
      rememberedUser,
      hasRememberedUser: !!rememberedUser,
      saveUser,
      clearUser,
      handleRememberMeChange,
      createRememberedUserFromAuth,
   };
}