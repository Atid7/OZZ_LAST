"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/images/Log.png"
        alt="The 1925"
        width={400}
        height={400}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}
