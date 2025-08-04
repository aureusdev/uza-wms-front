import { Link as NativeLink, useLocation } from '@tanstack/react-router'

interface LinkProps {
   children: React.ReactNode
   to: string
}

function WarehouseSidebarLink({ children, to }: LinkProps) {
   const { pathname } = useLocation();

   return (
      <NativeLink to={to}
         className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${pathname.startsWith(to)
            ? "bg-primary font-medium text-primary-foreground"
            : " hover:bg-secondary hover:text-secondary-foreground"
            }
         `}
      >
         <div className="flex items-center gap-2 font-light">
            {children}
         </div>
      </NativeLink>
   )
}

export default WarehouseSidebarLink