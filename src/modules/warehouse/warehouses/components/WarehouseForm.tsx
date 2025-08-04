import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle
} from '@/components/ui/dialog'
import {
   WarehouseType,
   type Warehouse,
   type CreateWarehouseInput,
   type UpdateWarehouseInput
} from '../types/warehouse.types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { formSchema } from '../schemas/warehouseFormSchema'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

interface WarehouseFormProps {
   warehouse?: Warehouse
   isOpen: boolean
   setIsOpen: (open: boolean) => void
   onSubmit?: (data: CreateWarehouseInput | UpdateWarehouseInput) => void
   isSubmitting?: boolean
}

function WarehouseForm({
   warehouse,
   isOpen,
   setIsOpen,
   onSubmit,
   isSubmitting = false
}: WarehouseFormProps) {

   const isEditing = !!warehouse

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: warehouse?.name || '',
         description: warehouse?.description || '',
         location: warehouse?.location || '',
         type: warehouse?.type || WarehouseType.MAIN,
      },
   })

   const handleSubmit = (values: z.infer<typeof formSchema>) => {
      if (onSubmit) {
         if (isEditing && warehouse) {
            onSubmit({
               id: warehouse.id,
               ...values
            } as UpdateWarehouseInput)
         } else {
            onSubmit(values as CreateWarehouseInput)
         }
      }
   }

   const onCancel = () => {
      setIsOpen(false)
      form.reset()
   }

   return (
      <Dialog open={isOpen} onOpenChange={(open) => {
         setIsOpen(open)
         if (!open) {
            form.reset()
         }
      }}>
         <DialogContent className='w-auto min-w-[380px] max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>
                  {isEditing ? 'Editar Almacén' : 'Agregar Almacén'}
               </DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Nombre del Almacén</FormLabel>
                           <FormControl>
                              <Input placeholder='Ej: Almacén Principal Centro' {...field} />
                           </FormControl>
                           <FormDescription>El nombre único para identificar el almacén.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='description'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Descripción</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder='Ej: Almacén principal para productos terminados'
                                 className='resize-y'
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Una breve descripción del propósito o características del almacén.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='location'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Ubicación Física</FormLabel>
                           <FormControl>
                              <Input placeholder='Ej: Av. Industrial 123, CDMX' {...field} />
                           </FormControl>
                           <FormDescription>La dirección física o referencia de ubicación del almacén.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='type'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Tipo de Almacén</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Selecciona un tipo' />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value='MAIN'>Principal</SelectItem>
                                 <SelectItem value='AUXILIAR'>Auxiliar</SelectItem>
                                 <SelectItem value='SITE'>Sitio</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormDescription>Clasificación del almacén (ej. principal, auxiliar, sitio).</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
                        Cancelar
                     </Button>
                     <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {isEditing ? 'Actualizar Almacén' : 'Agregar Almacén'}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default WarehouseForm