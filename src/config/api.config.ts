/**
 * Configuración de la API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
} as const;

/**
 * Construye una URL completa para un endpoint de la API
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}