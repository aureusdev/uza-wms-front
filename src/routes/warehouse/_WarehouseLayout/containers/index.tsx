import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/warehouse/_WarehouseLayout/containers/')(
   {
      beforeLoad: () => {
         return {};
      },
      component: lazyRouteComponent(() => import('@containers/pages/ContainersPage')),
   },
)
