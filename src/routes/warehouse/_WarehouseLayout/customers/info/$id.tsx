import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
   '/warehouse/_WarehouseLayout/customers/info/$id',
)({
   component: RouteComponent,
})

function RouteComponent() {
   return <div>Hello "/warehouse/_WarehouseLayout/customers/info/$id"!</div>
}
