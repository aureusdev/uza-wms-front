import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
   component: EmptyPage,
   beforeLoad: () => {
      return redirect({
         to: '/login',
         search: {
            redirectTo: window.location.pathname
         }
      })
   },
})

function EmptyPage() {
   return null
}