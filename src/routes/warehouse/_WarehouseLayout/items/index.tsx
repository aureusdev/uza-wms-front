import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/items/'
)({
   beforeLoad: () => { // Validar que el usuario esté autenticado
      return {};
   },
   component: lazyRouteComponent(() => import('@items/pages/ItemsPage')),
})