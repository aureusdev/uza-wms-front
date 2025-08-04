import type React from "react"

import { useEffect, useState } from "react"

type ThemeImageProps = {
   lightSrc: string // Imagen para modo claro
   darkSrc: string // Imagen para modo oscuro
   alt: string // Texto alternativo
   width?: number | string // Ancho (puede ser número o string como "100%")
   height?: number | string // Alto (puede ser número o string como "auto")
   className?: string // Clases CSS adicionales
   style?: React.CSSProperties // Estilos adicionales
}


export function ThemeImage({
   lightSrc,
   darkSrc,
   alt,
   width,
   height,
   className = "",
   style = {},
   ...props
}: ThemeImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
   const [isDarkMode, setIsDarkMode] = useState(false)

   useEffect(() => {
      // Función para verificar el modo oscuro
      const checkDarkMode = () => {
         const isDark =
            document.documentElement.classList.contains("dark") ||
            document.body.classList.contains("dark") ||
            document.documentElement.getAttribute("data-theme") === "dark" ||
            document.body.getAttribute("data-theme") === "dark"

         setIsDarkMode(isDark)
      }

      // Verificar inicialmente
      checkDarkMode()

      // Configurar un observador para detectar cambios en las clases
      const observer = new MutationObserver(checkDarkMode)

      // Observar cambios en el elemento html
      observer.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ["class", "data-theme"],
      })

      // Observar cambios en el elemento body
      observer.observe(document.body, {
         attributes: true,
         attributeFilter: ["class", "data-theme"],
      })

      // Limpiar el observador cuando el componente se desmonte
      return () => observer.disconnect()
   }, [])

   // Determinar qué imagen mostrar
   const imgSrc = isDarkMode ? darkSrc : lightSrc

   return (
      <img
         src={imgSrc || "/placeholder.svg"}
         alt={alt}
         width={width}
         height={height}
         className={className}
         style={style}
         {...props}
      />
   )
}

