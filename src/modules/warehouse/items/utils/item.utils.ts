import type { Item, ItemFilters, CreateItemInput, UpdateItemInput } from "../types/item.types";

// ===============================
// VALIDACIONES
// ===============================

export const itemValidations = {
   /**
    * Valida si un código de item es válido
    */
   isValidCode: (code: string): boolean => {
      return code.length >= 3 && code.length <= 30 && /^[A-Za-z0-9-_]+$/.test(code);
   },

   /**
    * Valida si un nombre de item es válido
    */
   isValidName: (name: string): boolean => {
      return name.length >= 2 && name.length <= 255;
   },

   /**
    * Valida si un precio es válido
    */
   isValidPrice: (price: number): boolean => {
      return price >= 0 && price <= 999999.99;
   },

   /**
    * Valida si un impuesto es válido
    */
   isValidTax: (tax: number): boolean => {
      return tax >= 0 && tax <= 100;
   },

   /**
    * Valida si una URL de imagen es válida
    */
   isValidImageUrl: (url: string): boolean => {
      try {
         new URL(url);
         return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
      } catch {
         return false;
      }
   },

   /**
    * Valida un objeto CreateItemInput completo
    */
   validateCreateInput: (input: CreateItemInput): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!itemValidations.isValidCode(input.code)) {
         errors.push("El código debe tener entre 3 y 30 caracteres alfanuméricos");
      }

      if (!itemValidations.isValidName(input.name)) {
         errors.push("El nombre debe tener entre 2 y 255 caracteres");
      }

      if (!itemValidations.isValidPrice(input.price)) {
         errors.push("El precio debe estar entre 0 y 999,999.99");
      }

      if (input.tax !== undefined && !itemValidations.isValidTax(input.tax)) {
         errors.push("El impuesto debe estar entre 0% y 100%");
      }

      if (input.brand && input.brand.length > 30) {
         errors.push("La marca no puede tener más de 30 caracteres");
      }

      if (input.imageUrl && !itemValidations.isValidImageUrl(input.imageUrl)) {
         errors.push("La URL de imagen no es válida");
      }

      return {
         isValid: errors.length === 0,
         errors,
      };
   },
};

// ===============================
// FORMATTERS
// ===============================

export const itemFormatters = {
   /**
    * Formatea el precio con moneda
    */
   formatPrice: (price: number, currency = "$"): string => {
      return `${currency}${price.toLocaleString("es-MX", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      })}`;
   },

   /**
    * Formatea el impuesto como porcentaje
    */
   formatTax: (tax: number): string => {
      return `${tax.toFixed(2)}%`;
   },

   /**
    * Formatea el precio total incluyendo impuestos
    */
   formatTotalPrice: (price: number, tax: number, currency = "$"): string => {
      const total = price + (price * tax / 100);
      return itemFormatters.formatPrice(total, currency);
   },

   /**
    * Formatea la fecha de creación/actualización
    */
   formatDate: (dateString: string): string => {
      return new Date(dateString).toLocaleDateString("es-MX", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   },

   /**
    * Trunca texto largo
    */
   truncateText: (text: string, maxLength = 50): string => {
      if (text.length <= maxLength) return text;
      return `${text.substring(0, maxLength)}...`;
   },

   /**
    * Formatea el código del item con prefijo
    */
   formatCode: (code: string, prefix = ""): string => {
      return prefix ? `${prefix}${code}` : code;
   },
};

// ===============================
// FILTROS Y BÚSQUEDA
// ===============================

export const itemFilters = {
   /**
    * Construye filtros para la consulta GraphQL
    */
   buildFilters: (params: {
      search?: string;
      categoryId?: number;
      priceRange?: { min?: number; max?: number };
      includeDeleted?: boolean;
      onlyDeleted?: boolean;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
   }): ItemFilters => {
      const filters: ItemFilters = {};

      if (params.search?.trim()) {
         filters.search = params.search.trim();
      }

      if (params.categoryId) {
         filters.itemCategoryId = params.categoryId;
      }

      if (params.priceRange?.min !== undefined) {
         filters.minPrice = params.priceRange.min;
      }

      if (params.priceRange?.max !== undefined) {
         filters.maxPrice = params.priceRange.max;
      }

      if (params.includeDeleted) {
         filters.withDeleted = true;
      }

      if (params.onlyDeleted) {
         filters.onlyDeleted = true;
      }

      filters.page = params.page || 1;
      filters.limit = params.limit || 10;

      if (params.sortBy) {
         filters.sortBy = params.sortBy as any;
      }

      if (params.sortOrder) {
         filters.sortOrder = params.sortOrder;
      }

      return filters;
   },

   /**
    * Filtra items localmente (para búsqueda en memoria)
    */
   filterItemsLocally: (items: Item[], searchTerm: string): Item[] => {
      if (!searchTerm.trim()) return items;

      const term = searchTerm.toLowerCase().trim();
      return items.filter(item =>
         item.code.toLowerCase().includes(term) ||
         item.name.toLowerCase().includes(term) ||
         item.brand?.toLowerCase().includes(term) ||
         item.description?.toLowerCase().includes(term) ||
         item.itemCategory?.name.toLowerCase().includes(term)
      );
   },

   /**
    * Ordena items localmente
    */
   sortItemsLocally: (
      items: Item[],
      sortBy: keyof Item,
      order: "ASC" | "DESC" = "ASC"
   ): Item[] => {
      return [...items].sort((a, b) => {
         const aVal = a[sortBy];
         const bVal = b[sortBy];

         if (aVal === undefined || aVal === null) return 1;
         if (bVal === undefined || bVal === null) return -1;

         let comparison = 0;
         if (typeof aVal === "string" && typeof bVal === "string") {
            comparison = aVal.localeCompare(bVal);
         } else if (typeof aVal === "number" && typeof bVal === "number") {
            comparison = aVal - bVal;
         } else {
            comparison = String(aVal).localeCompare(String(bVal));
         }

         return order === "DESC" ? -comparison : comparison;
      });
   },
};

// ===============================
// TRANSFORMADORES DE DATOS
// ===============================

export const itemTransformers = {
   /**
    * Convierte un item para edición
    */
   toUpdateInput: (item: Item): UpdateItemInput => ({
      id: item.id,
      code: item.code,
      name: item.name,
      brand: item.brand,
      price: item.price,
      tax: item.tax,
      description: item.description,
      specificDetails: item.specificDetails,
      imageUrl: item.imageUrl,
      itemCategoryId: item.itemCategory?.id,
   }),

   /**
    * Prepara datos para crear un nuevo item
    */
   prepareCreateInput: (formData: any): CreateItemInput => ({
      code: formData.code.trim(),
      name: formData.name.trim(),
      brand: formData.brand?.trim() || undefined,
      price: Number(formData.price),
      tax: Number(formData.tax) || 0,
      description: formData.description?.trim() || undefined,
      specificDetails: formData.specificDetails?.trim() || undefined,
      imageUrl: formData.imageUrl?.trim() || undefined,
      itemCategoryId: formData.itemCategoryId || undefined,
   }),

   /**
    * Calcula el precio total con impuestos
    */
   calculateTotalPrice: (price: number, tax: number): number => {
      return price + (price * tax / 100);
   },

   /**
    * Extrae solo los campos esenciales de un item
    */
   toEssentialData: (item: Item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      brand: item.brand,
      price: item.price,
      tax: item.tax,
      imageUrl: item.imageUrl,
      categoryName: item.itemCategory?.name,
      totalPrice: itemTransformers.calculateTotalPrice(item.price, item.tax),
   }),
};

// ===============================
// HELPERS PARA UI
// ===============================

export const itemUIHelpers = {
   /**
    * Genera opciones para select de ordenamiento
    */
   getSortOptions: () => [
      { value: "createdAt", label: "Fecha de creación" },
      { value: "updatedAt", label: "Última actualización" },
      { value: "code", label: "Código" },
      { value: "name", label: "Nombre" },
      { value: "brand", label: "Marca" },
      { value: "price", label: "Precio" },
   ],

   /**
    * Genera clase CSS basada en el estado del item
    */
   getItemStatusClass: (item: Item): string => {
      if (item.deletedAt) return "item-deleted";
      if (item.price <= 0) return "item-no-price";
      if (!item.itemCategory) return "item-no-category";
      return "item-active";
   },

   /**
    * Obtiene el color del badge según el precio
    */
   getPriceBadgeColor: (price: number): string => {
      if (price === 0) return "gray";
      if (price < 100) return "green";
      if (price < 1000) return "blue";
      return "purple";
   },

   /**
    * Genera texto alternativo para imágenes
    */
   getImageAlt: (item: Item): string => {
      return `Imagen de ${item.name} ${item.brand ? `- ${item.brand}` : ""}`.trim();
   },

   /**
    * Verifica si un item puede ser editado
    */
   canEditItem: (item: Item): boolean => {
      return !item.deletedAt;
   },

   /**
    * Verifica si un item puede ser eliminado
    */
   canDeleteItem: (item: Item): boolean => {
      return !item.deletedAt;
   },

   /**
    * Verifica si un item puede ser restaurado
    */
   canRestoreItem: (item: Item): boolean => {
      return !!item.deletedAt;
   },
};

// ===============================
// CONSTANTES ÚTILES
// ===============================

export const itemConstants = {
   // Límites de paginación
   PAGINATION_LIMITS: [5, 10, 15, 25, 50, 100],
   DEFAULT_LIMIT: 10,

   // Ordenamiento por defecto
   DEFAULT_SORT: "createdAt" as const,
   DEFAULT_ORDER: "DESC" as const,

   // Validaciones
   MIN_CODE_LENGTH: 3,
   MAX_CODE_LENGTH: 30,
   MIN_NAME_LENGTH: 2,
   MAX_NAME_LENGTH: 255,
   MAX_BRAND_LENGTH: 30,
   MAX_PRICE: 999999.99,
   MAX_TAX: 100,

   // Mensajes
   MESSAGES: {
      DELETE_CONFIRM: "¿Estás seguro de que deseas eliminar este item?",
      RESTORE_CONFIRM: "¿Estás seguro de que deseas restaurar este item?",
      HARD_DELETE_CONFIRM: "⚠️ ¿Estás seguro? Esta acción eliminará permanentemente el item y no se puede deshacer.",
      CREATE_SUCCESS: "Item creado exitosamente",
      UPDATE_SUCCESS: "Item actualizado exitosamente",
      DELETE_SUCCESS: "Item eliminado exitosamente",
      RESTORE_SUCCESS: "Item restaurado exitosamente",
   },
};

// ===============================
// FUNCIONES AUXILIARES
// ===============================

// Funciones auxiliares para el renderizado
export function getLoadingText(formLoading: boolean | undefined, uploading: boolean, deleting: boolean, checkingReferences: boolean) {
   if (deleting || checkingReferences) return 'Eliminando imagen...';
   if (uploading) return 'Subiendo imagen...';
   if (formLoading) return 'Guardando...';
   return 'Guardando...';
}