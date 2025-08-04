import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/warehouse/_WarehouseLayout/items/info/$id',
)({
  component: lazyRouteComponent(() => import('@/modules/warehouse/items/pages/ItemInfoPage')),
})