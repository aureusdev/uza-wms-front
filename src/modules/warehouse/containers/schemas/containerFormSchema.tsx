import { z } from 'zod'
import { ContainerStatus } from '../types/container.types'

// Define el esquema de validación con Zod
export const formSchema = z.object({
   code: z
      .string()
      .min(2, {
         message: "El código debe tener al menos 2 caracteres.",
      })
      .max(20, {
         message: "El código no debe exceder los 20 caracteres.",
      }),
   name: z
      .string()
      .min(2, {
         message: "El nombre debe tener al menos 2 caracteres.",
      })
      .max(50, {
         message: "El nombre no debe exceder los 50 caracteres.",
      }),
   description: z
      .string()
      .max(200, {
         message: "La descripción no debe exceder los 200 caracteres.",
      })
      .optional(),
   status: z.enum(ContainerStatus, {
      message: "Por favor, selecciona un estado válido para el contenedor.",
   }),
})

// Define el tipo de datos para el formulario
export type ContainerFormValues = z.infer<typeof formSchema>
