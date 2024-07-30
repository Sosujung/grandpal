"use client"

import { motion } from "framer-motion"
import _ from "lodash"

import { cn } from "@/lib/utils"

export const LoadingDots = ({
  shown,
  className,
}: {
  className?: string
  shown: boolean
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-opacity",

        shown ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {_.range(4).map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            repeatDelay: 1,
            duration: 0.5,
            delay: i * 0.1,
            repeat: Infinity,
          }}
          className={cn("size-2 rounded-full bg-primary")}
        />
      ))}
    </div>
  )
}
