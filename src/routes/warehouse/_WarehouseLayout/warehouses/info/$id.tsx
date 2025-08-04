import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/warehouse/_WarehouseLayout/warehouses/info/$id')({
   beforeLoad: () => {
      return {};
   },
   component: lazyRouteComponent(() => import('@warehouses/pages/WarehouseInfoPage')),
})