import { type ReactNode, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

type ScrollDirection = 'left' | 'right'

interface ScrollSplitHeroProps {
  direction?: ScrollDirection
  imageSrc: string
  imageAlt: string
  title: ReactNode
  sectionClassName?: string
  backgroundClassName?: string
  sectionHeightClassName?: string
  imageWidthClassName?: string
  imageAspectClassName?: string
  textContainerClassName?: string
  imageTravelPercent?: number
  textStartOffset?: string
  springStiffness?: number
  springDamping?: number
}

export function ScrollSplitHero({
  direction = 'right',
  imageSrc,
  imageAlt,
  title,
  sectionClassName = '',
  backgroundClassName = 'bg-transparent',
  sectionHeightClassName = 'h-[200vh]',
  imageWidthClassName = 'w-[40%]',
  imageAspectClassName = 'aspect-[5/4]',
  textContainerClassName = 'w-1/3',
  imageTravelPercent = 45,
  textStartOffset = '-20%',
  springStiffness = 180,
  springDamping = 22,
}: ScrollSplitHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const directionMultiplier = direction === 'right' ? 1 : -1

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'center start'],
  })

  // Spring para movimiento elástico y suave
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: springStiffness,
    damping: springDamping,
    restDelta: 0.001,
  })

  // Imagen: parte centrada y se desplaza hacia el lado configurado
  const imageX = useTransform(
    smoothProgress,
    [0, 1],
    ['0%', `${directionMultiplier * imageTravelPercent}%`],
  )

  // Texto: entra desde fuera hacia su posición final
  const textX = useTransform(
    smoothProgress,
    [0, 1],
    [textStartOffset, '0%'],
  )
  const textOpacity = useTransform(smoothProgress, [0, 0.4], [0, 1])

  const textSideStyle = direction === 'right'
    ? { left: '8%' }
    : { right: '8%' }

  return (
    <section
      ref={sectionRef}
      className={`relative ${sectionHeightClassName} ${backgroundClassName} ${sectionClassName}`}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">

        {/* Texto: se revela al lado contrario de donde va la imagen */}
        <motion.div
          className={`absolute z-0 ${textContainerClassName}`}
          style={{ ...textSideStyle, x: textX, opacity: textOpacity }}
        >
          {title}
        </motion.div>

        {/* Imagen: capa superior que se desplaza con el scroll */}
        <motion.div
          className={`relative z-10 overflow-hidden rounded-2xl shadow-2xl ${imageWidthClassName} ${imageAspectClassName}`}
          style={{ x: imageX }}
        >
          <img src={imageSrc} className="h-full w-full object-cover" alt={imageAlt} />
        </motion.div>

      </div>
    </section>
  )
}
