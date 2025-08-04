/**
 * Tipos para el módulo de clientes
 */

export interface Customer {
   id: number;
   externalId?: number;
   firstName: string;
   lastName: string;
   createdAt: string;
   updatedAt: string;
   deletedAt?: string;
}

export interface CreateCustomerInput {
   externalId?: number;
   firstName: string;
   lastName: string;
}

export interface UpdateCustomerInput {
   id: number;
   externalId?: number;
   firstName?: string;
   lastName?: string;
}

export interface FindCustomersDto {
   search?: string;
   externalId?: number;
   withDeleted?: boolean;
   onlyDeleted?: boolean;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedCustomers {
   items: Customer[];
   meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
   };
}