/**
 * Servicio para manejo de tokens JWT
 * Gestiona el almacenamiento, recuperación y renovación de tokens
 */
export class TokenService {
   private static readonly ACCESS_TOKEN_KEY = 'uza_access_token';
   private static readonly REFRESH_TOKEN_KEY = 'uza_refresh_token';
   private static readonly USER_DATA_KEY = 'uza_user_data';

   /**
    * Obtiene el token de acceso del localStorage
    */
   static getAccessToken(): string | null {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
   }

   /**
    * Obtiene el token de refresco del localStorage
    */
   static getRefreshToken(): string | null {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
   }

   /**
    * Obtiene los datos del usuario del localStorage
    */
   static getUserData(): any | null {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
   }

   /**
    * Almacena los tokens y datos del usuario
    */
   static setTokens(accessToken: string, refreshToken: string, userData: any): void {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
   }

   /**
    * Limpia todos los tokens y datos del usuario
    */
   static clearTokens(): void {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
   }

   /**
    * Verifica si el usuario está autenticado
    */
   static isAuthenticated(): boolean {
      const token = this.getAccessToken();
      if (!token) return false;

      try {
         // Decodificar el JWT para verificar expiración
         const payload = JSON.parse(atob(token.split('.')[1]));
         const currentTime = Date.now() / 1000;

         return payload.exp > currentTime;
      } catch (error) {
         console.error('Error al verificar token:', error);
         return false;
      }
   }

   /**
    * Maneja la expiración del token
    * Intenta refrescar el token o redirige al login
    */
   static async handleTokenExpiration(): Promise<void> {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
         this.redirectToLogin();
         return;
      }

      try {
         // Importar dinámicamente para evitar dependencias circulares
         const { apolloClient } = await import('../apollo/apolloClient');
         const { REFRESH_TOKEN_MUTATION } = await import('../graphql/auth.mutations');

         const { data } = await apolloClient.mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
               refreshTokenInput: {
                  refreshToken: refreshToken
               }
            }
         });

         if (data?.refreshToken) {
            this.setTokens(
               data.refreshToken.accessToken,
               data.refreshToken.refreshToken,
               data.refreshToken.user
            );

            // Recargar la página para aplicar el nuevo token
            window.location.reload();
         } else {
            this.redirectToLogin();
         }
      } catch (error) {
         console.error('Error al refrescar token:', error);
         this.redirectToLogin();
      }
   }

   /**
    * Redirige al usuario a la página de login
    */
   private static redirectToLogin(): void {
      this.clearTokens();
      window.location.href = '/login';
   }

   /**
    * Decodifica un JWT y retorna el payload
    */
   static decodeToken(token: string): any {
      try {
         return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
         console.error('Error al decodificar token:', error);
         return null;
      }
   }
}