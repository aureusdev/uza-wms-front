import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/operations/_OperationsLayout/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/operations/_OperationsLayout/profile"!</div>
}
