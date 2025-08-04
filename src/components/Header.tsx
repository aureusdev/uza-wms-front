import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

interface HeaderProps {
   title: string;
   subtitle?: string;
   children?: React.ReactNode;
}

function Header({ title, subtitle, children }: HeaderProps) {

   return (
      <header className='flex h-16 md:h-20 shrink-0 items-center gap-2 md:gap-4 border-b px-2 sm:px-4 w-full bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/30'>
         <SidebarTrigger className='-ml-1 flex-shrink-0' />
         <Separator
            orientation='vertical'
            className='mr-1 md:mr-2 data-[orientation=vertical]:h-4 flex-shrink-0'
         />

         {/* Contenedor principal responsive */}
         <div className='flex items-center w-full min-w-0'>
            {/* Sección de título - siempre visible pero adaptable */}
            <div className='flex items-center gap-2 md:gap-3 min-w-0 flex-1'>

               {/* Textos del header */}
               <div className='flex flex-col min-w-0 flex-1'>
                  <h1 className='text-lg md:text-xl lg:text-2xl font-bold uppercase truncate'>
                     {title}
                  </h1>
                  {subtitle && (
                     <p className='text-xs md:text-sm text-muted-foreground truncate hidden sm:block'>
                        {subtitle}
                     </p>
                  )}
               </div>
            </div>

            {/* Sección de acciones - responsive */}
            <div className='flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0 ml-2'>
               {children}
            </div>
         </div>
      </header>
   )
}

export default Header;