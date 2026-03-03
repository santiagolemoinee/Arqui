"use client"

import { memo, useEffect, useLayoutEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { Activity, BarChart3, Users, Zap, MessageSquare, Home, MessageCircle, FileText, TrendingUp, Wrench, Coins } from "lucide-react"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

export interface PainPoint {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
  iconColor: string
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
  }: {
    handleClick: (index: number) => void
    controls: any
    cards: PainPoint[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 2200 : 4500
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = (cylinderWidth / (2.5 * Math.PI)) * 0.7  // 30% más pequeño = tarjetas más juntas
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    // Auto-rotate carousel
    useEffect(() => {
      if (!isCarouselActive) return

      const interval = setInterval(() => {
        rotation.set(rotation.get() - 0.01)
      }, 50)

      return () => clearInterval(interval)
    }, [isCarouselActive, rotation])

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {cards.map((card, i) => (
            <motion.div
              key={`pain-point-${i}`}
              className="absolute flex h-full origin-center items-center justify-center p-0.5"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)
                  }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(i)}
            >
              <motion.div
                layoutId={`card-${i}`}
                className={`p-4 rounded-xl border-2 ${card.color} bg-white transition-all duration-300 group w-[140px] h-[180px] flex flex-col items-start justify-start cursor-pointer hover:shadow-xl hover:-translate-y-1`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg shadow-sm flex items-center justify-center mb-2 border border-gray-100 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xs font-bold tracking-tight leading-tight mb-1">{card.title}</h3>
                <p className="text-[9px] text-text-secondary leading-tight">{card.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

function PainPointsCarousel() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const cards: PainPoint[] = [
    {
      title: "Fuga de Márgenes",
      desc: "Desvíos financieros del 15% detectados cuando ya es imposible corregir.",
      icon: <Activity className="text-red-500 w-5 h-5" />,
      color: "border-red-500/10",
      iconColor: "text-red-500"
    },
    {
      title: "Inversión a Ciegas",
      desc: "Capital expuesto a reportes manuales estáticos sin verificación real.",
      icon: <BarChart3 className="text-orange-500 w-5 h-5" />,
      color: "border-orange-500/10",
      iconColor: "text-orange-500"
    },
    {
      title: "Ansiedad del Pozo",
      desc: "Compradores desconectados del progreso real y estatus financiero.",
      icon: <Users className="text-blue-500 w-5 h-5" />,
      color: "border-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      title: "Techo de Crecimiento",
      desc: "Empresas limitadas por procesos analógicos que no escalan.",
      icon: <Zap className="text-yellow-500 w-5 h-5" />,
      color: "border-yellow-500/10",
      iconColor: "text-yellow-500"
    },
    {
      title: "Comunicación Fragmentada",
      desc: "Instrucciones críticas perdidas en canales informales sin trazabilidad ni auditoría.",
      icon: <MessageSquare className="text-purple-500 w-5 h-5" />,
      color: "border-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      title: "Administración Obsoleta",
      desc: "Gestión de activos mediante procesos analógicos que degradan la experiencia del usuario.",
      icon: <Home className="text-green-500 w-5 h-5" />,
      color: "border-green-500/10",
      iconColor: "text-green-500"
    },
    {
      title: "Silencios Comunitarios",
      desc: "Residentes sin voz ni voto en las decisiones que afectan su propio entorno de vida.",
      icon: <MessageCircle className="text-pink-500 w-5 h-5" />,
      color: "border-pink-500/10",
      iconColor: "text-pink-500"
    },
    {
      title: "Activos sin Memoria",
      desc: "Pérdida total del historial técnico y planos al finalizar la entrega, restando valor futuro al inmueble.",
      icon: <FileText className="text-indigo-500 w-5 h-5" />,
      color: "border-indigo-500/10",
      iconColor: "text-indigo-500"
    },
    {
      title: "Pipeline Comercial Ciego",
      desc: "Oportunidades de venta y leads que se pierden por falta de un proceso comercial integrado y trazable.",
      icon: <TrendingUp className="text-teal-500 w-5 h-5" />,
      color: "border-teal-500/10",
      iconColor: "text-teal-500"
    },
    {
      title: "Inercia en Mantenimiento",
      desc: "Gastos imprevistos y deterioro del inmueble por una gestión de proveedores reactiva y sin monitoreo preventivo.",
      icon: <Wrench className="text-cyan-500 w-5 h-5" />,
      color: "border-cyan-500/10",
      iconColor: "text-cyan-500"
    },
    {
      title: "Exclusión de Capital",
      desc: "Inversores potenciales que no acceden al mercado inmobiliario por la rigidez de los instrumentos financieros tradicionales.",
      icon: <Coins className="text-emerald-500 w-5 h-5" />,
      color: "border-emerald-500/10",
      iconColor: "text-emerald-500"
    },
  ]

  const handleClick = (index: number) => {
    setActiveCard(index)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveCard(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative w-full">
      <AnimatePresence mode="sync">
        {activeCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            style={{ willChange: "opacity" }}
          >
            <motion.div
              layoutId={`card-${activeCard}`}
              className={`max-w-2xl w-full p-12 rounded-[2rem] border-2 ${cards[activeCard].color} bg-white shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-20 h-20 ${cards[activeCard].color} rounded-2xl shadow-premium flex items-center justify-center mb-8 border border-gray-50`}>
                {cards[activeCard].icon}
              </div>
              <h3 className="text-3xl font-bold mb-6 tracking-tight">{cards[activeCard].title}</h3>
              <p className="text-text-secondary text-lg leading-relaxed">{cards[activeCard].desc}</p>
              <button
                onClick={handleClose}
                className="mt-8 px-6 py-3 bg-primary text-white rounded-full font-bold hover:brightness-110 transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[600px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export { PainPointsCarousel }
