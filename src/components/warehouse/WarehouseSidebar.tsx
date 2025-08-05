import { useState } from "react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader
} from "../ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
   ArrowLeftRight,
   Boxes,
   ChevronDown,
   ClipboardList,
   FileText,
   Home,
   LayoutGrid,
   Package,
   PackageMinus,
   ShoppingBag,
   ShoppingCart,
   Tags,
   Truck,
   UsersRound,
   Warehouse,
} from "lucide-react";
import { ThemeImage } from "../theme/ThemeImage";
import { Separator } from "../ui/separator";

import WarehouseSidebarLink from "./WarehouseSidebarLink";
import WarehouseNavUser from "./WarehouseNavUser";

import type { User } from "@auth/types/auth.types";

// Importar assets de logos
import uzaLogoDark from '@/assets/uza-ntwk-logo-dark.svg'
import uzaLogoLight from '@/assets/uza-ntwk-logo-light.svg'


export function WarehouseSidebar({
   user,
   ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {

   const [openSections, setOpenSections] = useState({
      ventas: true,
      compras: true,
      inventario: true,
      administracion: true,
      reportes: true,
      movimientos: true,
      otros: true
   })

   const toggleSection = (section: string) => {
      setOpenSections((prev: any) => ({
         ...prev,
         [section]: !prev[section],
      }))
   }

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <div className="flex items-center justify-center w-full">
               <ThemeImage
                  lightSrc={uzaLogoDark}
                  darkSrc={uzaLogoLight}
                  alt="UZA Network Logo"
                  width={150}
                  height={150}
                  className="object-cover"
               />
               {/* <ThemeToggle /> */}
            </div>
            <Separator className="mt-4" />
         </SidebarHeader>
         <SidebarContent>
            {/* Menu Content */}
            <div className="flex-1 overflow-auto py-2 scrollbar">
               <nav className="grid gap-1 px-2">
                  {/* Dashboard */}
                  <WarehouseSidebarLink to="/warehouse/dashboard">
                     <Home className="h-4 w-4" />
                     <span className="font-medium uppercase">Dashboard</span>
                  </WarehouseSidebarLink>

                  {/* Ventas */}
                  <div className="grid gap-1">
                     <Collapsible open={openSections.ventas} onOpenChange={() => toggleSection("ventas")}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm  hover:bg-primary hover:text-primary-foreground">
                           <div className="flex items-center gap-3">
                              <ShoppingCart className="h-4 w-4" />
                              <span className="font-medium uppercase">Ventas</span>
                           </div>
                           <ChevronDown className={`h-4 w-4 transition-transform ${openSections.ventas ? "rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="grid gap-1 pl-9 pt-1">
                              <WarehouseSidebarLink to="/warehouse/customers">
                                 <UsersRound className="h-4 w-4" />
                                 Clientes
                              </WarehouseSidebarLink>
                           </div>
                        </CollapsibleContent>
                     </Collapsible>
                  </div>

                  {/* Compras */}
                  <div className="grid gap-1">
                     <Collapsible open={openSections.compras} onOpenChange={() => toggleSection("compras")}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm  hover:bg-primary hover:text-primary-foreground">
                           <div className="flex items-center gap-3">
                              <ShoppingBag className="h-4 w-4" />
                              <span className="font-medium uppercase">Compras</span>
                           </div>
                           <ChevronDown className={`h-4 w-4 transition-transform ${openSections.compras ? "rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="grid gap-1 pl-9 pt-1">
                              <WarehouseSidebarLink to="/warehouse/purchases">
                                 <ShoppingCart className="h-4 w-4" />
                                 Órdenes de compra
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/quotes">
                                 <FileText className="h-4 w-4" />
                                 Cotizaciones
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/receipts">
                                 <Package className="h-4 w-4" />
                                 Recepciones
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/suppliers">
                                 <Truck className="h-4 w-4" />
                                 Proveedores
                              </WarehouseSidebarLink>
                           </div>
                        </CollapsibleContent>
                     </Collapsible>
                  </div>

                  {/* Inventario */}
                  <div className="grid gap-1">
                     <Collapsible open={openSections.inventario} onOpenChange={() => toggleSection("inventario")}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm  hover:bg-primary hover:text-primary-foreground">
                           <div className="flex items-center gap-3">
                              <Package className="h-4 w-4" />
                              <span className="font-medium uppercase">Inventario</span>
                           </div>
                           <ChevronDown
                              className={`h-4 w-4 transition-transform ${openSections.inventario ? "rotate-180" : ""}`}
                           />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="grid gap-1 pl-9 pt-1">
                              <WarehouseSidebarLink to="/warehouse/items">
                                 <Boxes className="h-5 w-5" />
                                 Productos
                              </WarehouseSidebarLink>

                              <WarehouseSidebarLink to="/warehouse/warehouses">
                                 <Warehouse className="h-4 w-4" />
                                 Almacenes
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/containers">
                                 <Package className="h-4 w-4" />
                                 Contenedores
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/locations">
                                 <LayoutGrid className="h-4 w-4" />
                                 Estanterías
                              </WarehouseSidebarLink>

                              <WarehouseSidebarLink to="/warehouse/categories">
                                 <Tags className="h-4 w-4" />
                                 Categorías
                              </WarehouseSidebarLink>
                           </div>
                        </CollapsibleContent>
                     </Collapsible>
                  </div>

                  {/* Movimientos */}
                  <div className="grid gap-1">
                     <Collapsible open={openSections.movimientos} onOpenChange={() => toggleSection("movimientos")}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm  hover:bg-primary hover:text-primary-foreground">
                           <div className="flex items-center gap-3">
                              <Truck className="h-4 w-4" />
                              <span className="font-medium uppercase">Movimientos</span>
                           </div>
                           <ChevronDown
                              className={`h-4 w-4 transition-transform ${openSections.movimientos ? "rotate-180" : ""}`}
                           />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="grid gap-1 pl-9 pt-1">
                              <WarehouseSidebarLink to="/warehouse/stock-transfers">
                                 <ArrowLeftRight className="h-4 w-4" />
                                 Transferencias
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/assignments">
                                 <ClipboardList className="h-4 w-4" />
                                 Asignaciones
                              </WarehouseSidebarLink>
                              <WarehouseSidebarLink to="/warehouse/disposals">
                                 <PackageMinus className="h-4 w-4" />
                                 Bajas
                              </WarehouseSidebarLink>
                           </div>
                        </CollapsibleContent>
                     </Collapsible>
                  </div>

                  {/* Otros */}
                  <div className="grid gap-1">
                     <Collapsible open={openSections.movimientos} onOpenChange={() => toggleSection("movimientos")}>
                        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm  hover:bg-primary hover:text-primary-foreground">
                           <div className="flex items-center gap-3">
                              <Truck className="h-4 w-4" />
                              <span className="font-medium uppercase">Otros</span>
                           </div>
                           <ChevronDown
                              className={`h-4 w-4 transition-transform ${openSections.movimientos ? "rotate-180" : ""}`}
                           />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="grid gap-1 pl-9 pt-1">
                              <WarehouseSidebarLink to="/warehouse/stock-transfers">
                                 <ArrowLeftRight className="h-4 w-4" />
                                 Técnicos
                              </WarehouseSidebarLink>
                           </div>
                        </CollapsibleContent>
                     </Collapsible>
                  </div>
               </nav>
            </div>
         </SidebarContent>
         <Separator className="my-2" />
         <SidebarFooter>
            <WarehouseNavUser user={user} />
         </SidebarFooter>
      </Sidebar>
   )
}