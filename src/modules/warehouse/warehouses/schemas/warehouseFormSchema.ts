import { z } from 'zod'
import { WarehouseType } from '../types/warehouse.types'

/**
 * Define el esquema de validación con Zod
 *
 * El esquema tiene 4 campos:
 *  - `name`: El nombre del almacén, debe tener al menos 2 caracteres
 *             y no debe exceder de 50.
 *  - `description`: La descripción del almacén, puede ser opcional
 *                   y no debe exceder de 200 caracteres.
 *  - `location`: La ubicación del almacén, debe tener al menos 5 caracteres
 *                y no debe exceder de 100.
 *  - `type`: El tipo de almacén, debe ser uno de los valores definidos
 *            en `WarehouseType`.
 */
export const formSchema = z.object({
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
   location: z
      .string()
      .min(5, {
         message: "La ubicación debe tener al menos 5 caracteres.",
      })
      .max(100, {
         message: "La ubicación no debe exceder los 100 caracteres.",
      }),
   type: z.enum(WarehouseType, {
      message: "Por favor, selecciona un tipo de almacén.",
   }),
})

/**
 * Define el tipo de datos para el formulario
 */
export type WarehouseFormValues = z.infer<typeof formSchema>