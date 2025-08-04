import type { Customer } from '../types/customer.types';
import { useForm } from '@tanstack/react-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"

interface CustomerFormData {
   firstName: string;
   lastName: string;
   externalId?: number;
}

interface CustomerFormProps {
   customer?: Customer;
   onSubmit: (data: CustomerFormData & { id?: number }) => Promise<void>;
   onCancel: () => void;
   loading?: boolean;
   isOpen: boolean;
   setIsOpen: (isOpen: boolean) => void;
}

export function CustomerForm({
   customer,
   onSubmit,
   onCancel,
   loading,
   isOpen = false,
   setIsOpen,
}: CustomerFormProps) {

   const isEditing = !!customer;

   const form = useForm({
      defaultValues: {
         firstName: customer?.firstName || '',
         lastName: customer?.lastName || '',
         externalId: customer?.externalId || undefined,
      },
      onSubmit: async ({ value }) => {
         if (isEditing) {
            await onSubmit({
               id: customer.id,
               ...value,
            });
         } else {
            await onSubmit(value);
         }
      },
   });

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogContent className="">
            <DialogHeader>
               <DialogTitle className="sr-only">Agregar Cliente</DialogTitle>
            </DialogHeader>
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
               }}
            >
               <form.Field
                  name="firstName"
                  validators={{
                     onChange: ({ value }) =>
                        !value ? 'El nombre es requerido' : undefined,
                  }}
               >
                  {(field) => (
                     <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                           Nombre *
                        </Label>
                        <Input
                           id={field.name}
                           name={field.name}
                           value={field.state.value}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value)}
                           placeholder="Ingresa el nombre"
                           className="bg-white/50"
                           required
                        />
                        {field.state.meta.errors && (
                           <p className="text-sm text-red-600 flex items-center gap-1">
                              {field.state.meta.errors}
                           </p>
                        )}
                     </div>
                  )}
               </form.Field>

               <form.Field
                  name="lastName"
                  validators={{
                     onChange: ({ value }) =>
                        !value ? 'El apellido es requerido' : undefined,
                  }}
               >
                  {(field) => (
                     <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                           Apellido *
                        </Label>
                        <Input
                           id={field.name}
                           name={field.name}
                           value={field.state.value}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value)}
                           placeholder="Ingresa el apellido"
                           className="bg-white/50"
                           required
                        />
                        {field.state.meta.errors && (
                           <p className="text-sm text-red-600 flex items-center gap-1">
                              {field.state.meta.errors}
                           </p>
                        )}
                     </div>
                  )}
               </form.Field>



               <form.Field name="externalId">
                  {(field) => (
                     <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                           ID Externo
                        </Label>
                        <Input
                           id={field.name}
                           name={field.name}
                           type="number"
                           value={field.state.value || ''}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value ? parseInt(e.target.value) : undefined)}
                           placeholder="ID del sistema externo (opcional)"
                           className="bg-white/50"
                        />
                        <p className="text-xs text-slate-500">
                           Identificador para integración con sistemas externos
                        </p>
                     </div>
                  )}
               </form.Field>



               <div className="flex justify-end space-x-3 pt-6">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancel}
                     disabled={loading}
                     className="px-6"
                  >
                     Cancelar
                  </Button>
                  <Button
                     type="submit"
                     disabled={loading}
                  >
                     {loading ? 'Guardando...' : (isEditing ? 'Actualizar Cliente' : 'Crear Cliente')}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}