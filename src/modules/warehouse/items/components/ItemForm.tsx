import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from '@tanstack/react-form';
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { getLoadingText } from "../utils/item.utils";
import { Textarea } from "@/components/ui/textarea";
import { useItemCategories } from "@categories/item-categories/hooks/useItemCategories";
import { useUpload } from "@/modules/shared/uploads/hooks/useUpload";
import { useImageReferences } from "@/modules/shared/uploads/hooks/useImageReferences";
import ImageUploader from "@/modules/shared/uploads/components/ImageUploader";
import { ImagePreview } from "@/modules/shared/uploads/components/ImagePreview";
import type { ItemFormData, ItemFormProps } from "../types/itemForm.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ItemForm({ item, onSubmit, onCancel, loading, isOpen = false, setIsOpen }: ItemFormProps) {

   // Estados
   const isEditing = !!item;
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

   // Hooks
   const { data: categoriesData, loading: categoriesLoading } = useItemCategories();
   const categories = categoriesData?.itemCategories?.items || [];
   const {
      uploadProductImage,
      deleteImage,
      uploading,
      deleting,
   } = useUpload();
   const {
      checkReferences,
      references,
      loading: checkingReferences,
      canDelete,
      clearReferences,
   } = useImageReferences();

   // Formulario
   const form = useForm({
      defaultValues: {
         code: item?.code || '',
         name: item?.name || '',
         brand: item?.brand || '',
         price: item?.price || 0,
         tax: item?.tax || 0,
         description: item?.description || '',
         specificDetails: item?.specificDetails || '',
         imageUrl: item?.imageUrl || '',
         itemCategoryId: item?.itemCategory?.id || undefined,
      },
      onSubmit: handleSubmit,
   });

   // Efectos
   React.useEffect(() => {
      if (selectedFile) {
         const url = URL.createObjectURL(selectedFile);
         setPreviewUrl(url);
         return () => URL.revokeObjectURL(url);
      }
      setPreviewUrl(undefined);
   }, [selectedFile]);

   // Funciones
   async function handleSubmit({ value }: { value: ItemFormData }) {
      try {
         let finalImageUrl = value.imageUrl;

         // Subir imagen si hay un archivo seleccionado
         if (selectedFile) {
            const uploadedUrl = await uploadProductImage(selectedFile);
            if (uploadedUrl) {
               finalImageUrl = uploadedUrl;
               toast.success('Imagen subida exitosamente');
            }
         }

         // Preparar datos para enviar
         const submitData = {
            ...value,
            imageUrl: finalImageUrl,
         };

         await onSubmit({ ...submitData, id: item?.id });
         resetForm();
         toast.success(isEditing ? 'Ítem actualizado exitosamente' : 'Ítem creado exitosamente');
      } catch (error) {
         console.error('Error al guardar el ítem:', error);
         toast.error('Error al guardar el ítem');
      }
   }

   function resetForm() {
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(undefined);
      clearReferences();
   }

   async function handleRemoveImage() {
      const currentImageUrl = form.getFieldValue('imageUrl');

      if (!currentImageUrl && !selectedFile) return;

      try {
         // Si hay una imagen del servidor, verificar referencias antes de eliminar
         if (currentImageUrl && !selectedFile) {
            const refs = await checkReferences(currentImageUrl);

            if (refs.length > 0) {
               toast.error('No se puede eliminar la imagen porque está en uso');
               return;
            }

            await deleteImage(currentImageUrl, 'product');
         }

         // Limpiar el campo de imagen en el formulario
         form.setFieldValue('imageUrl', '');
         setSelectedFile(null);
         setPreviewUrl(undefined);
         toast.success('Imagen eliminada exitosamente');
      } catch (error) {
         console.error('Error al eliminar la imagen:', error);
         toast.error('Error al eliminar la imagen');
      }
   }

   return (
      <div>
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-auto min-w-[380px] max-w-2xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>
                     {isEditing ? 'Editar Ítem' : 'Crear Nuevo Ítem'}
                  </DialogTitle>
               </DialogHeader>

               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     form.handleSubmit();
                  }}
                  className="space-y-6"
               >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        name="code"
                        label="Código"
                        placeholder="Ej. SKU12345"
                        required
                        validators={{
                           onChange: ({ value }: { value: string }) =>
                              !value ? 'El código es requerido' : undefined,
                        }}
                        form={form}
                     />

                     <FormField
                        name="name"
                        label="Nombre"
                        placeholder="Ej. Camiseta de Algodón"
                        required
                        validators={{
                           onChange: ({ value }: { value: string }) =>
                              !value ? 'El nombre es requerido' : undefined,
                        }}
                        form={form}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        name="brand"
                        label="Marca"
                        placeholder="Ej. Nike, Adidas"
                        form={form}
                     />

                     <FormField
                        name="itemCategoryId"
                        label="Categoría"
                        form={form}
                        as={({ value, onChange }: any) => (
                           <Select
                              value={value?.toString() || ''}
                              onValueChange={(val) => onChange(parseInt(val) || undefined)}
                              onOpenChange={() => clearReferences()}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                 {categoriesLoading ? (
                                    <SelectItem value="loading" disabled>
                                       Cargando categorías...
                                    </SelectItem>
                                 ) : (
                                    categories.map((category: any) => (
                                       <SelectItem key={category.id} value={category.id.toString()}>
                                          {category.name}
                                       </SelectItem>
                                    ))
                                 )}
                              </SelectContent>
                           </Select>
                        )}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        name="price"
                        label="Precio"
                        type="number"
                        placeholder="0.00"
                        required
                        validators={{
                           onChange: ({ value }: { value: number }) =>
                              value < 0 ? 'El precio no puede ser negativo' : undefined,
                        }}
                        form={form}
                     />

                     <FormField
                        name="tax"
                        label="Impuesto (%)"
                        type="number"
                        placeholder="0.00"
                        form={form}
                     />
                  </div>

                  <FormField
                     name="description"
                     label="Descripción"
                     placeholder="Descripción del producto"
                     form={form}
                     as={Textarea}
                  />

                  <FormField
                     name="specificDetails"
                     label="Detalles Específicos"
                     placeholder="Detalles específicos del producto"
                     form={form}
                     as={Textarea}
                  />

                  {/* Sección de Imagen */}
                  <div className="space-y-4">
                     <Label className="text-sm font-medium">Imagen del Producto</Label>
                     <div className="flex flex-col md:flex-row gap-6">
                        {/* Previsualización */}
                        {previewUrl && (
                           <div className="flex-shrink-0">
                              <div className="relative w-full max-w-md p-4 aspect-square bg-muted border-2 border-dashed border-muted-3 rounded-lg overflow-hidden">
                                 <ImagePreview
                                    imageUrl={form.getFieldValue('imageUrl')}
                                    previewUrl={previewUrl}
                                    altText="Previsualización del producto"
                                    onDelete={handleRemoveImage}
                                    deleting={deleting}
                                    checkingReferences={checkingReferences}
                                    hasReferences={references.length > 0}
                                    isAdmin={false} // TODO: Obtener del contexto
                                    canDelete={canDelete(false)} // TODO: Obtener isAdmin del contexto
                                    deleteDialogTitle="¿Eliminar imagen del producto?"
                                    deleteDialogDescription={
                                       form.getFieldValue('imageUrl') && !selectedFile
                                          ? "Esta acción eliminará permanentemente la imagen del servidor."
                                          : "Esta acción removerá la imagen del formulario."
                                    }
                                 />
                              </div>
                           </div>
                        )}

                        {/* Botón de subida */}
                        {!previewUrl && (
                           <div className="w-full max-w-md">
                              <ImageUploader
                                 type='product'
                                 onUploadSuccess={(url: string) => {
                                    form.setFieldValue('imageUrl', url);
                                    setPreviewUrl(url);
                                    setSelectedFile(null);
                                    toast.success('Imagen del producto subida exitosamente');
                                 }}
                                 className="w-full"
                              />
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Botones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading || uploading || deleting || checkingReferences}
                        className="px-6"
                     >
                        Cancelar
                     </Button>
                     <Button
                        type="submit"
                        disabled={loading || uploading || deleting || checkingReferences}
                     >
                        {loading || uploading || deleting || checkingReferences ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {getLoadingText(loading, uploading, deleting, checkingReferences)}
                           </>
                        ) : (
                           isEditing ? 'Actualizar Producto' : 'Guardar Producto'
                        )}
                     </Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default ItemForm;
