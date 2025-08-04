import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/warehouse/_WarehouseLayout/warehouses/')({
   beforeLoad: () => {
      return {};
   },
   component: lazyRouteComponent(() => import('@warehouses/pages/WarehousePage')),
})
