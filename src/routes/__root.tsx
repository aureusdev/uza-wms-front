import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@auth/apollo/apolloClient'
import { AuthProvider } from '@auth/contexts/AuthContext'
import { ThemeProvider } from 'next-themes'


export const Route = createRootRoute({
   component: RootComponent,
})

function RootComponent() {
   return (
      <ThemeProvider
         attribute="class"
         defaultTheme="light"
         storageKey="vite-ui-theme"
      >
         <ApolloProvider client={apolloClient}>
            <AuthProvider>
               <Outlet />
               <Toaster
                  expand={true}
                  richColors
                  position="top-right"
               />
            </AuthProvider>
         </ApolloProvider>
      </ThemeProvider>
   )
}
