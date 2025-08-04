import { redirect, useNavigate, createFileRoute } from '@tanstack/react-router'
import { isAuthenticated } from '@auth/utils/authRouter.util'
import { LoginForm } from '@auth/components/LoginForm'
import { useRememberMe } from '@auth/hooks/useRememberMe'
import { toast } from 'sonner'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeImage } from '@/components/theme/ThemeImage'

// Importar assets de logos
import uzaLogoDark from '@/assets/uza-ntwk-logo-dark.webp'
import uzaLogoLight from '@/assets/uza-ntwk-logo-light.webp'

// Definir la interfaz para los search params de esta ruta
interface LoginSearchParams {
   redirectTo?: string
   error?: string
}

export const Route = createFileRoute('/login')({
   component: LoginPage,
   beforeLoad: ({ search }) => {
      // Si ya está autenticado, redirigir al dashboard
      if (isAuthenticated()) {
         throw redirect({
            to: (search as LoginSearchParams).redirectTo || '/warehouse/dashboard',
         })
      }
      return {}
   },
   validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
      return {
         redirectTo: search.redirectTo as string,
         error: search.error as string,
      }
   },
})

function LoginPage() {
   const search = Route.useSearch()
   const navigate = useNavigate()
   const { hasRememberedUser } = useRememberMe()

   const handleLoginSuccess = () => {
      toast.success('Login exitoso')
      navigate({
         to: search.redirectTo || '/warehouse/dashboard',
      })
   }

   const handleLoginError = (error: string) => {
      toast.error(`Error de login: ${error}`)
   }

   return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
         <Card className='w-full max-w-md shadow-xl border-0'>
            <CardHeader className='space-y-1'>
               <div className='flex justify-center mb-4'>
                  <ThemeImage
                     lightSrc={uzaLogoDark}
                     darkSrc={uzaLogoLight}
                     alt='UZA Network Logo'
                     width={250}
                     height={300}
                     className='object-cover'
                  />
               </div>
               <CardTitle className='text-2xl font-semibold text-center text-foreground'>
                  {hasRememberedUser ? 'Bienvenido de nuevo' : 'Bienvenido'}
               </CardTitle>
               <CardDescription className='text-center text-muted-foreground'>
                  {hasRememberedUser ? 'Ingresa tu contraseña para continuar' : 'Ingresa tus credenciales para acceder'}
               </CardDescription>
            </CardHeader>
            <LoginForm
               onSuccess={handleLoginSuccess}
               onError={handleLoginError}
            />
         </Card>
      </div>
   )
}