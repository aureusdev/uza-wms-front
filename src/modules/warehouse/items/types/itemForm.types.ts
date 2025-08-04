import type { Item } from "./item.types";

export interface ItemFormData {
   code: string;
   name: string;
   brand?: string;
   price: number;
   tax?: number;
   description?: string;
   specificDetails?: string;
   imageUrl?: string;
   itemCategoryId?: number;
}

export interface ItemFormProps {
   item?: Item;
   onSubmit: (data: ItemFormData & { id?: number }) => Promise<void>;
   onCancel: () => void;
   loading?: boolean;
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
}

export interface FormFieldProps {
   name: string;
   label: string;
   type?: string;
   placeholder?: string;
   required?: boolean;
   validators?: any;
   as?: React.ComponentType<any>;
   form: any; // Referencia al formulario de TanStack
   [key: string]: any;
}
