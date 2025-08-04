import { buildApiUrl } from '../../../../config/api.config';
import { TokenService } from '../../auth/services/tokenService';
import type { 
  DeleteResponse, 
  ImageInfo, 
  ImageListResponse, 
  ReferenceInfo,
  PaginationOptions 
} from '../types/upload.types';

/**
 * Service for image API communication
 * Handles CRUD operations for images with proper error handling and authentication
 */
export class ImageService {
  /**
   * Builds authorization headers for API requests
   */
  private static getAuthHeaders(): HeadersInit {
    const token = TokenService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Extracts filename from image URL
   */
  private static extractFilenameFromUrl(imageUrl: string): string {
    // Handle both full URLs and relative paths
    const url = new URL(imageUrl, window.location.origin);
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  /**
   * Determines image type from URL path
   */
  private static getImageTypeFromUrl(imageUrl: string): 'avatar' | 'product' {
    if (imageUrl.includes('/avatars/') || imageUrl.includes('/avatar/')) {
      return 'avatar';
    }
    return 'product';
  }

  /**
   * Handles API response and throws appropriate errors
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Deletes an image from the server
   * @param imageUrl - The URL of the image to delete
   * @param type - The type of image ('avatar' | 'product')
   * @returns Promise<DeleteResponse>
   */
  static async deleteImage(imageUrl: string, type: 'avatar' | 'product'): Promise<DeleteResponse> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    const endpoint = type === 'avatar' ? 'avatar' : 'product-image';
    
    try {
      const response = await fetch(buildApiUrl(`/uploads/${endpoint}/${filename}`), {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<DeleteResponse>(response);
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? `Error deleting image: ${error.message}` 
          : 'Unknown error occurred while deleting image'
      );
    }
  }

  /**
   * Gets detailed information about an image
   * @param imageUrl - The URL of the image
   * @returns Promise<ImageInfo>
   */
  static async getImageInfo(imageUrl: string): Promise<ImageInfo> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    const type = this.getImageTypeFromUrl(imageUrl);
    const endpoint = type === 'avatar' ? 'avatar' : 'product-image';
    
    try {
      const response = await fetch(buildApiUrl(`/uploads/${endpoint}/${filename}/info`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<ImageInfo>(response);
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? `Error getting image info: ${error.message}` 
          : 'Unknown error occurred while getting image info'
      );
    }
  }

  /**
   * Lists images with pagination
   * @param type - The type of images to list ('avatar' | 'product')
   * @param options - Pagination and sorting options
   * @returns Promise<ImageListResponse>
   */
  static async listImages(
    type: 'avatar' | 'product', 
    options: PaginationOptions = {}
  ): Promise<ImageListResponse> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const endpoint = type === 'avatar' ? 'avatars' : 'products';
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    try {
      const response = await fetch(buildApiUrl(`/uploads/${endpoint}?${queryParams}`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<ImageListResponse>(response);
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? `Error listing images: ${error.message}` 
          : 'Unknown error occurred while listing images'
      );
    }
  }

  /**
   * Checks what entities reference a specific image
   * @param imageUrl - The URL of the image to check
   * @returns Promise<ReferenceInfo[]>
   */
  static async checkReferences(imageUrl: string): Promise<ReferenceInfo[]> {
    const filename = this.extractFilenameFromUrl(imageUrl);
    
    try {
      const response = await fetch(buildApiUrl('/uploads/check-references'), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ filename }),
      });

      const data = await this.handleResponse<{ references: ReferenceInfo[] }>(response);
      return data.references;
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? `Error checking references: ${error.message}` 
          : 'Unknown error occurred while checking references'
      );
    }
  }

  /**
   * Batch delete multiple images
   * @param imageUrls - Array of image URLs to delete
   * @returns Promise<{ success: string[], failed: { url: string, error: string }[] }>
   */
  static async deleteMultipleImages(imageUrls: string[]): Promise<{
    success: string[];
    failed: { url: string; error: string }[];
  }> {
    const results = {
      success: [] as string[],
      failed: [] as { url: string; error: string }[],
    };

    // Process deletions in parallel but with error handling for each
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const type = this.getImageTypeFromUrl(url);
        await this.deleteImage(url, type);
        results.success.push(url);
      } catch (error) {
        results.failed.push({
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    await Promise.all(deletePromises);
    return results;
  }
}