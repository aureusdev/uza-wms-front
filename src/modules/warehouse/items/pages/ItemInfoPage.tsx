import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Route } from '@/routes/warehouse/_WarehouseLayout/items/info/$id'
import { } from 'lucide-react'
import { useItem } from '../hooks/useItems'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, DollarSign, Package, Tag, Edit, Trash2, ArrowLeft } from "lucide-react"

function ItemInfo() {

   const { id } = Route.useParams()
   const nav = Route.useNavigate()
   const { item } = useItem({
      id: Number(id),
      options: {
         errorPolicy: 'all'
      }
   })

   function formatCurrency(amount: number) {
      return new Intl.NumberFormat("es-MX", {
         style: "currency",
         currency: "MXN",
      }).format(amount)
   }

   function formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString("es-ES", {
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      })
   }

   function calculateTotalPrice(price: number, taxRate: number) {
      const taxAmount = price * (taxRate / 100)
      return price + taxAmount
   }


   const taxAmount = item?.price ? item.price * (item?.tax || 0) : 0
   const totalPrice = calculateTotalPrice(item?.price || 0, item?.tax || 0)

   return (
      <>
         <Header title={item?.name || ''} subtitle={item?.brand || ''}>
            <Button variant='secondary' onClick={() => nav({
               to: '/warehouse/items'
            })}>
               <ArrowLeft className='h-4 w-4' />
               <span className='hidden sm:inline'>Volver</span>
            </Button>
         </Header>


         <div className="p-6 space-y-6">
            {/* Header Card */}
            <Card>
               <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                     <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-full sm:w-48 h-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                           <img
                              src={item?.imageUrl || "/placeholder.svg?height=200&width=200&query=product"}
                              alt={item?.name}
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="gap-1">
                                 <Package className="h-3 w-3" />
                                 {item?.code}
                              </Badge>
                              <Badge variant="secondary">{item?.itemCategory?.name || 'Sin categoría'}</Badge>
                           </div>
                           <CardTitle className="text-2xl lg:text-3xl mb-2 break-words">{item?.name}</CardTitle>
                           <p className="text-lg text-muted-foreground mb-4">
                              Marca: <span className="font-medium">{item?.brand}</span>
                           </p>
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div className="text-3xl font-bold text-primary">{formatCurrency(item?.price || 0)}</div>
                              <div className="text-sm text-muted-foreground">
                                 + {formatCurrency(taxAmount)} ({item?.tax}% IVA)
                              </div>
                           </div>
                           <div className="text-lg font-semibold mt-1">Total: {formatCurrency(totalPrice)}</div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                           <Edit className="h-4 w-4" />
                           Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2">
                           <Trash2 className="h-4 w-4" />
                           Eliminar
                        </Button>
                     </div>
                  </div>
               </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Información del Producto */}
               <div className="lg:col-span-2 space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Descripción del Producto</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{item?.description}</p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Detalles Específicos</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg">
                           <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">
                              {item?.specificDetails}
                           </pre>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Panel Lateral */}
               <div className="space-y-6">
                  {/* Información de Precios */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <DollarSign className="h-5 w-5" />
                           Información de Precios
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-medium">Precio base:</span>
                           <span className="font-semibold">{formatCurrency(item?.price || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-medium">IVA ({item?.tax}%):</span>
                           <span className="font-semibold">{formatCurrency(taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                           <span className="text-base font-medium">Precio total:</span>
                           <span className="text-lg font-bold text-primary">{formatCurrency(totalPrice)}</span>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Categoría */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Tag className="h-5 w-5" />
                           Categoría
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
                           <Badge variant="default" className="text-sm">
                              {item?.itemCategory?.name || 'Sin categoría'}
                           </Badge>
                           <p className="text-sm text-muted-foreground">{item?.itemCategory?.description || 'Sin descripción'}</p>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Información del Sistema */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <CalendarDays className="h-5 w-5" />
                           Información del Sistema
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div>
                           <p className="text-sm font-medium">ID del producto</p>
                           <p className="text-sm text-muted-foreground">#{item?.id}</p>
                        </div>
                        <Separator />
                        <div>
                           <p className="text-sm font-medium">Creado</p>
                           <p className="text-xs text-muted-foreground">{formatDate(item?.createdAt || '')}</p>
                           <p className="text-xs text-muted-foreground">Por usuario ID: {item?.createdById}</p>
                        </div>
                        <div>
                           <p className="text-sm font-medium">Última actualización</p>
                           <p className="text-xs text-muted-foreground">{formatDate(item?.updatedAt || '')}</p>
                           <p className="text-xs text-muted-foreground">Por usuario ID: {item?.updatedById}</p>
                        </div>
                        {item?.deletedAt && (
                           <div>
                              <p className="text-sm font-medium text-destructive">Eliminado</p>
                              <p className="text-xs text-muted-foreground">{formatDate(item?.deletedAt || '')}</p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </>
   )
}

export default ItemInfo