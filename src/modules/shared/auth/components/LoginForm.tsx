import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '../contexts/AuthContext';
import { useRememberMe } from '../hooks/useRememberMe';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Eye, EyeOff, User } from "lucide-react";
import { getInitials, getAvatarColor } from '../utils/avatarUtils';
import { toast } from 'sonner';

interface LoginFormProps {
   onSuccess?: () => void;
   onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
   const { login } = useAuth();
   const [submissionError, setSubmissionError] = useState<string | null>(null);
   const [showPassword, setShowPassword] = useState(false);
   const {
      rememberMe,
      rememberedUser,
      hasRememberedUser,
      clearUser,
      handleRememberMeChange,
      createRememberedUserFromAuth
   } = useRememberMe();

   const form = useForm({
      defaultValues: {
         username: rememberedUser?.username || '',
         password: '',
      },
      onSubmit: async ({ value }) => {
         setSubmissionError(null);
         try {
            const loginResponse = await login(value);

            // Si "Remember me" está activado, guardar el usuario con datos reales
            if (rememberMe) {
               const rememberedUserData = await createRememberedUserFromAuth(
                  loginResponse.user,
                  loginResponse.authCredential
               );
               handleRememberMeChange(true, rememberedUserData);
            }

            onSuccess?.();
         } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error de autenticación';
            setSubmissionError(errorMessage);
            onError?.(errorMessage);
         }
      },
   });

   const handleChangeUser = () => {
      clearUser();
      form.setFieldValue('username', '');
      form.setFieldValue('password', '');
   };

   const handleClickButton = () => {
      toast.info('Función de recuperación de contraseña aún no implementada.', {
         description: 'Próximamente podrás recuperar tu contraseña.',
         duration: 5000,
         action: {
            label: 'Entendido',
            onClick: () => { }
         }
      });
   };

   return (
      <CardContent className="space-y-6">
         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               form.handleSubmit();
            }}
            className="space-y-6"
         >
            {hasRememberedUser ? (
               // Vista con usuario recordado
               <div className="space-y-6">
                  {/* Información del usuario recordado */}
                  <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg border border-border">
                     <Avatar className="h-12 w-12 rounded-lg">
                        {rememberedUser?.avatar && (
                           <AvatarImage
                              src={rememberedUser.avatar}
                              alt={rememberedUser.name}
                           />
                        )}
                        <AvatarFallback className={`font-medium ${getAvatarColor(rememberedUser?.name || '')}`}>
                           {rememberedUser?.name
                              ? getInitials(rememberedUser.name)
                              : <User className="h-6 w-6" />
                           }
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        <p className="font-medium text-foreground">{rememberedUser?.name}</p>
                        <p className="text-sm text-muted-foreground">@{rememberedUser?.username}</p>
                     </div>
                     <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={handleChangeUser}
                        className="text-muted-foreground hover:text-foreground"
                     >
                        Cambiar
                     </Button>
                  </div>

                  {/* Solo campo de contraseña */}
                  <form.Field
                     name="password"
                     validators={{
                        onChange: ({ value }) =>
                           !value ? 'La contraseña es requerida' : undefined,
                     }}
                  >
                     {(field) => (
                        <div className="space-y-2">
                           <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                              Contraseña
                           </Label>
                           <div className="relative">
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={(e) => field.handleChange(e.target.value)}
                                 type={showPassword ? "text" : "password"}
                                 placeholder="••••••••"
                                 className="h-11 border-input focus:border-ring focus:ring-ring pr-10"
                                 required
                              />
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="sm"
                                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                 onClick={() => setShowPassword(!showPassword)}
                              >
                                 {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                 ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                 )}
                              </Button>
                           </div>
                           {field.state.meta.errors && (
                              <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                           )}
                        </div>
                     )}
                  </form.Field>
               </div>
            ) : (
               // Vista normal de login
               <div className="space-y-4">
                  <form.Field
                     name="username"
                     validators={{
                        onChange: ({ value }) =>
                           !value ? 'El nombre de usuario es requerido' : undefined,
                     }}
                  >
                     {(field) => (
                        <div className="space-y-2">
                           <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                              Usuario
                           </Label>
                           <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              type="text"
                              placeholder="Ingresa tu usuario"
                              className="h-11 border-input focus:border-ring focus:ring-ring"
                              required
                           />
                           {field.state.meta.errors && (
                              <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                           )}
                        </div>
                     )}
                  </form.Field>

                  <form.Field
                     name="password"
                     validators={{
                        onChange: ({ value }) =>
                           !value ? 'La contraseña es requerida' : undefined,
                     }}
                  >
                     {(field) => (
                        <div className="space-y-2">
                           <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
                              Contraseña
                           </Label>
                           <div className="relative">
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={(e) => field.handleChange(e.target.value)}
                                 type={showPassword ? "text" : "password"}
                                 placeholder="••••••••"
                                 className="h-11 border-input focus:border-ring focus:ring-ring pr-10"
                                 required
                              />
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="sm"
                                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                 onClick={() => setShowPassword(!showPassword)}
                              >
                                 {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                 ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                 )}
                              </Button>
                           </div>
                           {field.state.meta.errors && (
                              <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                           )}
                        </div>
                     )}
                  </form.Field>
               </div>
            )}

            {!hasRememberedUser && (
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                     <Checkbox
                        id="remember"
                        className="border-input"
                        checked={rememberMe}
                        onCheckedChange={(checked) => handleRememberMeChange(!!checked)}
                     />
                     <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Recordarme
                     </Label>
                  </div>
                  <Button onClick={handleClickButton} variant='link' type='button' className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                     ¿Olvidaste tu contraseña?
                  </Button>
               </div>
            )}

            {hasRememberedUser && (
               <div className="flex justify-end">
                  <Button onClick={handleClickButton} variant='link' type='button' className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                     ¿Olvidaste tu contraseña?
                  </Button>
               </div>
            )}

            {submissionError && (
               <p className="text-sm text-destructive text-center">{submissionError}</p>
            )}

            <Button
               type="submit"
               className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
               disabled={form.state.isSubmitting}
            >
               {form.state.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
         </form>
      </CardContent>
   );
}