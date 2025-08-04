import {
   Drawer as DrawerNative,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from './ui/button'

interface DrawerProps {
   title: string
   description?: string
   trigger: React.ReactNode
   children?: React.ReactNode
   footer?: React.ReactNode
   buttonText?: string
}

function Drawer({
   title = 'Titulo',
   description = 'Descripción',
   buttonText = 'Enviar',
   ...props
}: DrawerProps) {
   return (
      <DrawerNative direction='right'>
         <DrawerTrigger asChild>
            {props.trigger}
         </DrawerTrigger>
         <DrawerContent>
            <DrawerHeader>
               <DrawerTitle>
                  {title}
               </DrawerTitle>
               <DrawerDescription>
                  {description}
               </DrawerDescription>
            </DrawerHeader>
            <div className='p-4 overflow-y-auto'>
               {props.children}
            </div>

            <DrawerFooter>
               {props.footer ? (
                  props.footer
               ) : (
                  <>
                     <Button>{buttonText}</Button>
                     <DrawerClose asChild>
                        <Button
                           variant='outline'
                           className='w-full'>
                           Cancelar
                        </Button>
                     </DrawerClose>
                  </>
               )}
            </DrawerFooter>
         </DrawerContent>
      </DrawerNative>
   )
}

export default Drawer