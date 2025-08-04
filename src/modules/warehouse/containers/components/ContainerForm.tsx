import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

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
   ContainerStatus,
   type Container,
   type CreateContainerInput,
   type UpdateContainerInput
} from '../types/container.types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { formSchema } from '../schemas/containerFormSchema'

interface ContainerFormProps {
   container?: Container
   isOpen: boolean
   setIsOpen: (open: boolean) => void
   onSubmit?: (data: CreateContainerInput | UpdateContainerInput) => void
   isSubmitting?: boolean
}

function ContainerForm({
   container,
   isOpen,
   setIsOpen,
   onSubmit,
   isSubmitting = false
}: ContainerFormProps) {

   const isEditing = !!container

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         code: container?.code || '',
         name: container?.name || '',
         description: container?.description || '',
         status: container?.status || ContainerStatus.AVAILABLE,
      },
   })

   const handleSubmit = (values: z.infer<typeof formSchema>) => {
      if (onSubmit) {
         if (isEditing && container) {
            onSubmit({
               id: container.id,
               ...values
            } as UpdateContainerInput)
         } else {
            onSubmit(values as CreateContainerInput)
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
                  {isEditing ? 'Editar Contenedor' : 'Agregar Contenedor'}
               </DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                  <FormField
                     control={form.control}
                     name='code'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Código del Contenedor</FormLabel>
                           <FormControl>
                              <Input placeholder='Ej: CNT-001' {...field} />
                           </FormControl>
                           <FormDescription>Código único para identificar el contenedor.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Nombre del Contenedor</FormLabel>
                           <FormControl>
                              <Input placeholder='Ej: Contenedor Principal' {...field} />
                           </FormControl>
                           <FormDescription>Nombre descriptivo del contenedor.</FormDescription>
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
                                 placeholder='Ej: Contenedor para almacenar productos frágiles'
                                 className='resize-y'
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Una breve descripción del propósito o características del contenedor.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='status'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Estado del Contenedor</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Selecciona un estado' />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value={ContainerStatus.AVAILABLE}>Disponible</SelectItem>
                                 <SelectItem value={ContainerStatus.INACTIVE}>Inactivo</SelectItem>
                                 <SelectItem value={ContainerStatus.IN_REVIEW}>En Revisión</SelectItem>
                                 <SelectItem value={ContainerStatus.ASSIGNED}>Asignado</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormDescription>Estado actual del contenedor.</FormDescription>
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
                        {isEditing ? 'Actualizar Contenedor' : 'Agregar Contenedor'}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default ContainerForm
