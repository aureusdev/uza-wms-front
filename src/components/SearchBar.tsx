import type React from "react"
import { SearchIcon, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ChangeEvent } from "react"
import { cn } from "@/lib/utils"

type ClassNameProps = React.HTMLAttributes<HTMLDivElement>["className"]

interface SearchBarProps {
   value: string
   onChange: (e: ChangeEvent<HTMLInputElement>) => void
   onClear?: () => void
   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
   placeholder?: string
   className?: ClassNameProps
}

export function SearchBar({
   value,
   onChange,
   onClear,
   onKeyDown,
   className,
   placeholder = "Buscar un elemento..."
}: SearchBarProps) {

   const handleClear = () => {
      if (onClear) {
         onClear()
         return
      }

      const syntheticEvent = {
         target: {
            value: ""
         }
      } as ChangeEvent<HTMLInputElement>

      onChange(syntheticEvent)
   };

   return (
      <div className={cn("w-full min-w-auto", className)}>
         <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
               placeholder={placeholder}
               className={cn(
                  "pl-10 w-full border-input",
                  value ? "pr-10" : ""
               )}
               value={value}
               onChange={onChange}
               onKeyDown={onKeyDown}
            />
            {value && (
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted"
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
               >
                  <XCircle className="h-4 w-4 text-muted-foreground/70 hover:text-foreground transition-colors" />
               </Button>
            )}
         </div>
      </div>
   )
}