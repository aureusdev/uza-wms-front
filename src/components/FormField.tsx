import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormFieldProps } from "@items/types/itemForm.types";

const FormField = ({
   name,
   label,
   type = 'text',
   placeholder,
   required = false,
   validators,
   form,
   as: Component = Input,
   ...props
}: FormFieldProps) => (
   <form.Field
      name={name as any}
      validators={validators}
   >
      {(field: any) => (
         <div className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium">
               {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Component
               id={field.name}
               name={field.name}
               value={field.state.value}
               onBlur={field.handleBlur}
               onChange={(e: any) => {
                  const value = type === 'number' ?
                     (e.target.value ? parseFloat(e.target.value) : 0) :
                     e.target.value;
                  field.handleChange(value);
               }}
               placeholder={placeholder}
               className="bg-white/50"
               required={required}
               type={type}
               {...props}
            />
            {field.state.meta.errors && (
               <p className="text-sm text-red-600">
                  {field.state.meta.errors}
               </p>
            )}
         </div>
      )}
   </form.Field>
);

export default FormField;