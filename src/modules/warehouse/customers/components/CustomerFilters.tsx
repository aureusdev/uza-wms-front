import Drawer from '@/components/Drawer'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'


function CustomerFilters() {
   return (
      <Drawer
         title='Filters'
         trigger={
            <Button variant='outline' className='text-muted-foreground'>
               <Filter className='h-4 w-4' />
               Filtros
            </Button>
         }
      >
         <div>CustomerFilters</div>
      </Drawer>
   )

}

export default CustomerFilters