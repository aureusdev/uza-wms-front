import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/unauthorized"!</div>
}
