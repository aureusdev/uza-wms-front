import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageService } from './imageService';
import { TokenService } from '../../auth/services/tokenService';
import { buildApiUrl } from '../../../../config/api.config';
import type { DeleteResponse, ImageInfo, ImageListResponse, ReferenceInfo } from '../types/upload.types';

// Mock dependencies
vi.mock('../../auth/services/tokenService');
vi.mock('../../../../config/api.config');

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ImageService', () => {
  const mockToken = 'mock-jwt-token';
  const mockImageUrl = 'http://localhost:3000/uploads/products/test-image.jpg';
  const mockAvatarUrl = 'http://localhost:3000/uploads/avatars/avatar.jpg';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(TokenService.getAccessToken).mockReturnValue(mockToken);
    vi.mocked(buildApiUrl).mockImplementation((endpoint) => `http://localhost:3000${endpoint}`);
    
    // Setup window.location.origin for URL parsing
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('deleteImage', () => {
    it('should successfully delete a product image', async () => {
      const mockResponse: DeleteResponse = {
        success: true,
        message: 'Image deleted successfully',
        filename: 'test-image.jpg',
        spaceFreed: 1024,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await ImageService.deleteImage(mockImageUrl, 'product');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/product-image/test-image.jpg',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should successfully delete an avatar image', async () => {
      const mockResponse: DeleteResponse = {
        success: true,
        message: 'Avatar deleted successfully',
        filename: 'avatar.jpg',
        spaceFreed: 512,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await ImageService.deleteImage(mockAvatarUrl, 'avatar');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/avatar/avatar.jpg',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors properly', async () => {
      const errorResponse = {
        message: 'File not found',
        statusCode: 404,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(ImageService.deleteImage(mockImageUrl, 'product'))
        .rejects.toThrow('File not found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(ImageService.deleteImage(mockImageUrl, 'product'))
        .rejects.toThrow('Error deleting image: Network error');
    });
  });

  describe('getImageInfo', () => {
    it('should successfully get image info for product image', async () => {
      const mockImageInfo: ImageInfo = {
        id: '1',
        filename: 'test-image.jpg',
        originalName: 'original-test.jpg',
        type: 'product',
        size: 1024,
        mimeType: 'image/jpeg',
        url: mockImageUrl,
        dimensions: { width: 800, height: 600 },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        references: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockImageInfo),
      });

      const result = await ImageService.getImageInfo(mockImageUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/product-image/test-image.jpg/info',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockImageInfo);
    });

    it('should successfully get image info for avatar', async () => {
      const mockImageInfo: ImageInfo = {
        id: '2',
        filename: 'avatar.jpg',
        originalName: 'user-avatar.jpg',
        type: 'avatar',
        size: 512,
        mimeType: 'image/jpeg',
        url: mockAvatarUrl,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        references: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockImageInfo),
      });

      const result = await ImageService.getImageInfo(mockAvatarUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/avatar/avatar.jpg/info',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockImageInfo);
    });

    it('should handle errors when getting image info', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Image not found' }),
      });

      await expect(ImageService.getImageInfo(mockImageUrl))
        .rejects.toThrow('Image not found');
    });
  });

  describe('listImages', () => {
    it('should successfully list product images with default options', async () => {
      const mockListResponse: ImageListResponse = {
        images: [
          {
            id: '1',
            filename: 'test1.jpg',
            originalName: 'test1.jpg',
            type: 'product',
            size: 1024,
            mimeType: 'image/jpeg',
            url: 'http://localhost:3000/uploads/products/test1.jpg',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            references: [],
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListResponse),
      });

      const result = await ImageService.listImages('product');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/products?page=1&limit=10&sortBy=createdAt&sortOrder=desc',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockListResponse);
    });

    it('should list images with custom pagination options', async () => {
      const mockListResponse: ImageListResponse = {
        images: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListResponse),
      });

      const result = await ImageService.listImages('avatar', {
        page: 2,
        limit: 5,
        sortBy: 'filename',
        sortOrder: 'asc',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/avatars?page=2&limit=5&sortBy=filename&sortOrder=asc',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockListResponse);
    });

    it('should handle errors when listing images', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' }),
      });

      await expect(ImageService.listImages('product'))
        .rejects.toThrow('Internal server error');
    });
  });

  describe('checkReferences', () => {
    it('should successfully check image references', async () => {
      const mockReferences: ReferenceInfo[] = [
        {
          entityType: 'item',
          entityId: 1,
          fieldName: 'imageUrl',
          entityName: 'Test Product',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ references: mockReferences }),
      });

      const result = await ImageService.checkReferences(mockImageUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/uploads/check-references',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
          body: JSON.stringify({ filename: 'test-image.jpg' }),
        }
      );
      expect(result).toEqual(mockReferences);
    });

    it('should handle errors when checking references', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid filename' }),
      });

      await expect(ImageService.checkReferences(mockImageUrl))
        .rejects.toThrow('Error checking references: Invalid filename');
    });
  });

  describe('deleteMultipleImages', () => {
    it('should successfully delete multiple images', async () => {
      const imageUrls = [mockImageUrl, mockAvatarUrl];
      
      // Mock successful responses for both deletions
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Deleted', filename: 'test-image.jpg' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Deleted', filename: 'avatar.jpg' }),
        });

      const result = await ImageService.deleteMultipleImages(imageUrls);

      expect(result.success).toEqual(imageUrls);
      expect(result.failed).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures in batch deletion', async () => {
      const imageUrls = [mockImageUrl, mockAvatarUrl];
      
      // Mock one success and one failure
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Deleted', filename: 'test-image.jpg' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ message: 'File not found' }),
        });

      const result = await ImageService.deleteMultipleImages(imageUrls);

      expect(result.success).toEqual([mockImageUrl]);
      expect(result.failed).toEqual([
        { url: mockAvatarUrl, error: 'File not found' },
      ]);
    });
  });

  describe('utility methods', () => {
    it('should extract filename from URL correctly', async () => {
      // Test through deleteImage which uses extractFilenameFromUrl internally
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Deleted', filename: 'test.jpg' }),
      });

      await ImageService.deleteImage('http://localhost:3000/uploads/products/test.jpg', 'product');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test.jpg'),
        expect.any(Object)
      );
    });

    it('should determine image type from URL correctly', async () => {
      // Test avatar URL detection
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '1', type: 'avatar' }),
      });

      await ImageService.getImageInfo('http://localhost:3000/uploads/avatars/test.jpg');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/avatar/'),
        expect.any(Object)
      );
    });

    it('should handle missing authentication token', () => {
      vi.mocked(TokenService.getAccessToken).mockReturnValue(null);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // Should still make the request but with null token
      return ImageService.deleteImage(mockImageUrl, 'product').then(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': 'Bearer null',
            }),
          })
        );
      });
    });
  });
});