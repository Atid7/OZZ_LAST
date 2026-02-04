"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const interval = 16;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setFadeOut(true);
        setTimeout(onComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[200] bg-gradient-to-b from-background via-background to-background/95 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{
                opacity: 0,
                y: "100vh",
                x: `${Math.random() * 100}vw`,
              }}
              animate={{
                opacity: [0, 0.6, 0.4, 0],
                y: "-20vh",
                scale: [1, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
              style={{
                width: 3 + Math.random() * 8,
                height: 3 + Math.random() * 8,
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5
                    ? "oklch(0.7 0.2 40)"
                    : "oklch(0.55 0.24 25)"
                } 0%, transparent 70%)`,
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>

        {/* Central pulsing glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.25) 0%, oklch(0.7 0.18 50 / 0.1) 30%, transparent 70%)",
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo with fire ring effect */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Rotating fire ring */}
            <motion.div
              className="absolute inset-0 -m-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 30}deg) translateY(-100px) translateX(-50%)`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  <Flame
                    className="w-4 h-4"
                    style={{
                      color: i % 2 === 0 ? "oklch(0.55 0.24 25)" : "oklch(0.72 0.16 70)",
                      filter: `drop-shadow(0 0 8px ${i % 2 === 0 ? "oklch(0.55 0.24 25)" : "oklch(0.72 0.16 70)"})`,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pulsing glow behind logo */}
            <motion.div
              className="absolute inset-0 -m-12 rounded-full"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, oklch(0.55 0.24 25 / 0.6) 0%, oklch(0.7 0.18 50 / 0.3) 40%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            {/* Logo */}
            <motion.div
              className="relative w-28 h-28 md:w-36 md:h-36"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/images/Log.png"
                alt="OZ Food"
                fill
                sizes="(max-width: 768px) 112px, 144px"
                className="object-contain"
                priority
                style={{
                  filter: "drop-shadow(0 0 40px oklch(0.55 0.24 25 / 0.8))",
                }}
              />
            </motion.div>

            {/* Rising flame particles from logo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, y: 0, x: (i - 3.5) * 20 }}
                  animate={{
                    opacity: [0, 1, 0.6, 0],
                    y: [-30, -80, -120],
                    scale: [0.5, 1.2, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                  style={{
                    width: 10,
                    height: 15,
                    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    background: `linear-gradient(to top, oklch(0.55 0.24 25), oklch(0.72 0.16 70))`,
                    filter: "blur(1.5px)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Brand name with fire effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-3"
          >
            <h1 className="font-display text-5xl md:text-6xl tracking-wider text-center">
              <motion.span
                className="text-fire inline-block"
                animate={{
                  textShadow: [
                    "0 0 30px oklch(0.55 0.24 25 / 0.6)",
                    "0 0 50px oklch(0.55 0.24 25 / 1)",
                    "0 0 30px oklch(0.55 0.24 25 / 0.6)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                OZ FOOD
              </motion.span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs md:text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase mb-12"
          >
            Premium Street Food
          </motion.p>

          {/* Enhanced progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 280 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="relative"
          >
            {/* Outer glow */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-lg" />

            {/* Track */}
            <div className="relative h-1.5 bg-border/30 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Progress fill */}
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.24 25), oklch(0.65 0.2 40), oklch(0.72 0.16 70))",
                  boxShadow: "0 0 20px oklch(0.55 0.24 25 / 0.8), 0 0 40px oklch(0.55 0.24 25 / 0.4)",
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.4), transparent)",
                  }}
                />

                {/* Glowing end cap */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  style={{
                    background: "oklch(0.72 0.16 70)",
                    boxShadow: "0 0 15px oklch(0.72 0.16 70)",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress percentage */}
            <motion.p
              className="text-center text-xs tracking-[0.2em] text-foreground/80 font-bold mt-4"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              {Math.round(progress)}%
            </motion.p>
          </motion.div>
        </div>

        {/* Corner flame decorations */}
        {[
          { top: 8, left: 8, rotate: 0 },
          { top: 8, right: 8, rotate: 90 },
          { bottom: 8, left: 8, rotate: 270 },
          { bottom: 8, right: 8, rotate: 180 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={pos}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Flame
                className="w-5 h-5 text-primary"
                style={{
                  filter: "drop-shadow(0 0 8px oklch(0.55 0.24 25 / 0.8))",
                  transform: `rotate(${pos.rotate}deg)`,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
