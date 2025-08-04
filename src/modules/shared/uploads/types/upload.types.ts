export interface UploadResponse {
   message: string;
   url: string;
   filename: string;
   originalName: string;
   size: number;
}

export interface UploadError {
   message: string;
   statusCode: number;
}

// New interfaces for extended image management functionality

export interface DeleteResponse {
   success: boolean;
   message: string;
   filename: string;
   referencesFound?: FileReference[];
   spaceFreed?: number;
}

export interface ImageInfo {
   id: string;
   filename: string;
   originalName: string;
   type: 'avatar' | 'product';
   size: number;
   mimeType: string;
   url: string;
   dimensions?: {
      width: number;
      height: number;
   };
   createdAt: string;
   updatedAt: string;
   lastAccessedAt?: string;
   references: FileReference[];
}

export interface FileReference {
   id: string;
   entityType: 'user' | 'item' | 'category';
   entityId: number;
   fieldName: string;
   createdAt: string;
}

export interface ImageListResponse {
   images: ImageInfo[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface ReferenceInfo {
   entityType: 'user' | 'item' | 'category';
   entityId: number;
   fieldName: string;
   entityName?: string;
}

export interface OrphanedFile {
   filename: string;
   type: 'avatar' | 'product';
   size: number;
   createdAt: string;
   lastAccessedAt?: string;
   path: string;
}

export interface CleanupReport {
   totalFilesProcessed: number;
   filesDeleted: number;
   spaceFreed: number;
   errors: string[];
   deletedFiles: string[];
   skippedFiles: string[];
}

export interface PaginationOptions {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
}

// Hook return types

export interface UseUploadReturn {
   // Existing functionality
   uploading: boolean;
   uploadAvatar: (file: File) => Promise<string | null>;
   uploadProductImage: (file: File) => Promise<string | null>;
   
   // New functionality
   deleting: boolean;
   deleteImage: (imageUrl: string, type: 'avatar' | 'product') => Promise<boolean>;
   getImageInfo: (imageUrl: string) => Promise<ImageInfo | null>;
   listImages: (type: 'avatar' | 'product', page?: number) => Promise<ImageListResponse | null>;
}

export interface UseImageManagementReturn {
   images: ImageInfo[];
   loading: boolean;
   error: string | null;
   
   refreshImages: () => Promise<void>;
   deleteMultipleImages: (imageUrls: string[]) => Promise<boolean>;
   getImageReferences: (imageUrl: string) => Promise<ReferenceInfo[]>;
}