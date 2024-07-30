"use client"

import { ReactNode, useMemo } from "react"
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Variants,
} from "framer-motion"
import _ from "lodash"

import { cn } from "@/lib/utils"

const DEFAULT_SCALE = 0.7
const variants: Variants = {
  responding: {
    height: "10rem",
    width: "100%",
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
  hidden: {
    width: 0,
    height: 0,
    opacity: 1,
    transition: {
      delay: 0,
    },
  },
  default: {
    scale: DEFAULT_SCALE,
    opacity: 1,
  },
  inactive: {
    scale: 0.5,
    opacity: 0.5,
    transition: {
      delay: 0.1,
    },
  },
}

const Bubbly = ({
  isActive,
  isResponding,
  isTalking,
  soundLevel,
  responseSoundLevel,
  className,
  children,
  ...props
}: {
  isActive: boolean
  isResponding: boolean
  isTalking: boolean
  soundLevel: number
  responseSoundLevel: number
  children?: ReactNode
} & HTMLMotionProps<"div">) => {
  const scale = useMemo(() => {
    const base = Math.max(soundLevel - 0.5, 0) ** 3 * 1.7
    const scale = Math.min(base + DEFAULT_SCALE, 1.1)
    return scale
  }, [soundLevel])

  return (
    <>
      <motion.div
        initial="inactive"
        animate={
          isResponding
            ? "hidden"
            : !isActive
              ? "inactive"
              : isTalking
                ? {
                    scale,
                    opacity: 1,
                    transition: { duration: 0.1, delay: 0 },
                  }
                : "default"
        }
        transition={{ duration: 0.3 }}
        variants={variants}
        className={cn("size-72 rounded-full bg-primary", className)}
        {...props}
      >
        {children}
      </motion.div>
      <motion.div
        initial="hidden"
        animate={isResponding ? "responding" : "hidden"}
        variants={variants}
        exit="hidden"
        className="flex items-center gap-1"
      >
        <AnimatePresence>
          {isResponding &&
            _.range(5).map((i) => (
              <Bar key={i} soundLevel={responseSoundLevel} />
            ))}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
Bubbly.displayName = "Bubbly"

const Bar = ({ soundLevel }: { soundLevel: number }) => {
  const height = useMemo(() => {
    const base = Math.max(soundLevel - 0.3, 0)
    // soundlevel +- 30%
    const min = _.random(base - 0.3, base)
    const max = _.random(base, base + 0.3)
    return `${Math.min(_.random(min, max), 1) * 100}%`
  }, [soundLevel])

  return (
    <motion.div
      animate={{
        height,
        transition: { duration: 0.2 },
      }}
      exit={{ height: 0, transition: { duration: 0.2 } }}
      className="h-full w-12 rounded-full bg-primary"
    />
  )
}

export { Bubbly }
