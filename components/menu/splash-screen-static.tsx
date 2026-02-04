"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Pre-generate particle data for consistent rendering
const generateParticles = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 3 + Math.random() * 6,
    duration: 4 + Math.random() * 3,
    delay: Math.random() * 3,
    color: Math.random() > 0.4 ? "ember" : Math.random() > 0.5 ? "gold" : "crimson",
  }));

const generateSmokeParticles = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,
    size: 60 + Math.random() * 80,
    duration: 6 + Math.random() * 4,
    delay: Math.random() * 4,
  }));

const generateSparkles = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360,
    distance: 100 + Math.random() * 40,
    size: 2 + Math.random() * 3,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
  }));

export function SplashScreenStatic() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  // Memoize particles to prevent regeneration on re-renders
  const particles = useMemo(() => generateParticles(35), []);
  const smokeParticles = useMemo(() => generateSmokeParticles(8), []);
  const sparkles = useMemo(() => generateSparkles(16), []);

  useEffect(() => {
    setMounted(true);

    // Smooth eased progress
    const startTime = Date.now();
    const duration = 2500;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 100);

      if (t < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setPhase("reveal");
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  if (!mounted) return null;

  const getParticleColor = (type: string) => {
    switch (type) {
      case "ember":
        return "oklch(0.7 0.22 45)";
      case "gold":
        return "oklch(0.8 0.16 70)";
      case "crimson":
        return "oklch(0.55 0.26 25)";
      default:
        return "oklch(0.7 0.22 45)";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(0.06 0.015 25) 0%, oklch(0.08 0.01 30) 50%, oklch(0.05 0.02 20) 100%)",
        }}
      >
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(ellipse 80% 60% at 50% 120%, oklch(0.35 0.2 25 / 0.4) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 50% 120%, oklch(0.4 0.22 35 / 0.5) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 50% 120%, oklch(0.35 0.2 25 / 0.4) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Ambient top glow */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh]"
            style={{
              background: "radial-gradient(ellipse 100% 100% at 50% 0%, oklch(0.55 0.24 25 / 0.08) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Rising smoke/heat distortion effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {smokeParticles.map((p) => (
            <motion.div
              key={`smoke-${p.id}`}
              className="absolute rounded-full"
              initial={{ y: "110vh", x: `${p.x}vw`, opacity: 0 }}
              animate={{
                y: "-20vh",
                opacity: [0, 0.06, 0.04, 0],
                scale: [1, 2, 3],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
              style={{
                width: p.size,
                height: p.size,
                background: "radial-gradient(circle, oklch(0.5 0.1 30 / 0.3) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
          ))}
        </div>

        {/* Fire ember particles - cinematic rising effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={`particle-${p.id}`}
              className="absolute"
              initial={{
                y: "105vh",
                x: `${p.x}vw`,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: "-10vh",
                opacity: [0, 1, 0.8, 0.4, 0],
                scale: [0, 1, 1.2, 0.8, 0],
                x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 10}vw`],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
            >
              <motion.div
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${getParticleColor(p.color)} 0%, ${getParticleColor(p.color)}88 40%, transparent 70%)`,
                  boxShadow: `0 0 ${p.size * 2}px ${getParticleColor(p.color)}`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Central dramatic glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: phase === "reveal" ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
            scale: phase === "reveal" ? [1, 1.2, 1] : [1, 1.1, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
            style={{
              background: `
                radial-gradient(ellipse at center, 
                  oklch(0.55 0.26 25 / 0.35) 0%, 
                  oklch(0.6 0.22 35 / 0.2) 25%,
                  oklch(0.7 0.18 50 / 0.1) 45%,
                  transparent 70%
                )
              `,
              filter: "blur(40px)",
            }}
          />
        </motion.div>

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo container with epic effects */}
          <motion.div
            className="relative"
            initial={{ scale: 0.3, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Outer rotating ring - slow and majestic */}
            <motion.div
              className="absolute inset-0 -m-16 md:-m-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.55 0.24 25 / 0.6)" />
                    <stop offset="50%" stopColor="oklch(0.72 0.16 70 / 0.3)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 25 / 0.6)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="0.5"
                  strokeDasharray="8 12"
                  opacity="0.6"
                />
              </svg>
            </motion.div>

            {/* Inner rotating ring - opposite direction */}
            <motion.div
              className="absolute inset-0 -m-10 md:-m-12"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke="oklch(0.72 0.16 70 / 0.4)"
                  strokeWidth="1"
                  strokeDasharray="2 20"
                />
              </svg>
            </motion.div>

            {/* Orbiting sparkles */}
            <motion.div
              className="absolute inset-0 -m-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              {sparkles.slice(0, 8).map((s) => (
                <motion.div
                  key={`sparkle-${s.id}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${s.angle}deg) translateY(-${s.distance}px)`,
                  }}
                  animate={{
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: s.duration,
                    repeat: Infinity,
                    delay: s.delay,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    style={{
                      width: s.size,
                      height: s.size,
                      borderRadius: "50%",
                      background: s.id % 2 === 0 ? "oklch(0.55 0.24 25)" : "oklch(0.8 0.14 70)",
                      boxShadow: `0 0 ${s.size * 4}px ${s.id % 2 === 0 ? "oklch(0.55 0.24 25)" : "oklch(0.8 0.14 70)"}`,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pulsing aura layers */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`aura-${i}`}
                className="absolute inset-0 -m-8 rounded-full"
                animate={{
                  scale: [1, 1.3 + i * 0.1, 1],
                  opacity: [0.3 - i * 0.08, 0.6 - i * 0.15, 0.3 - i * 0.08],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
                style={{
                  background: `radial-gradient(circle, oklch(0.55 0.24 25 / ${0.4 - i * 0.1}) 0%, transparent 70%)`,
                  filter: `blur(${15 + i * 10}px)`,
                }}
              />
            ))}

            {/* Logo with dramatic entrance */}
            <motion.div
              className="relative w-44 h-44 md:w-56 md:h-56"
              animate={{
                scale: phase === "reveal" ? [1, 1.05, 1] : [1, 1.02, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  filter: [
                    "drop-shadow(0 0 30px oklch(0.55 0.24 25 / 0.5)) drop-shadow(0 0 60px oklch(0.55 0.24 25 / 0.3))",
                    "drop-shadow(0 0 50px oklch(0.55 0.24 25 / 0.7)) drop-shadow(0 0 80px oklch(0.55 0.24 25 / 0.4))",
                    "drop-shadow(0 0 30px oklch(0.55 0.24 25 / 0.5)) drop-shadow(0 0 60px oklch(0.55 0.24 25 / 0.3))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/Log.png"
                  alt="OZ Food"
                  fill
                  sizes="(max-width: 768px) 176px, 224px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Rising flame wisps from logo */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`flame-${i}`}
                  className="absolute left-1/2"
                  style={{ marginLeft: (i - 3.5) * 10 }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 0.9, 0.6, 0],
                    y: [-10, -40, -70, -100],
                    scale: [0.5, 1, 0.7, 0.3],
                    x: [(i - 3.5) * 2, (i - 3.5) * 4],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                >
                  <div
                    style={{
                      width: 6 + Math.random() * 4,
                      height: 10 + Math.random() * 6,
                      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                      background: `linear-gradient(to top, oklch(0.55 0.26 25), oklch(0.7 0.2 45), oklch(0.8 0.14 70))`,
                      filter: "blur(1px)",
                      boxShadow: "0 0 8px oklch(0.7 0.2 45 / 0.5)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Brand name with staggered letter reveal */}
          <motion.div
            className="mt-8 mb-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="font-display text-5xl md:text-7xl tracking-[0.15em] flex">
              {"OZ FOOD".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.06,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    background: "linear-gradient(180deg, oklch(0.98 0.01 60) 0%, oklch(0.9 0.04 50) 50%, oklch(0.72 0.16 70) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 0 60px oklch(0.55 0.24 25 / 0.5)",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Tagline with reveal animation */}
          <motion.div className="overflow-hidden mb-14">
            <motion.p
              className="text-[10px] md:text-xs font-medium tracking-[0.5em] text-muted-foreground/80 uppercase"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Premium Street Food
            </motion.p>
          </motion.div>

          {/* Epic progress bar */}
          <motion.div
            className="relative w-56 md:w-72"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Track background */}
            <div className="relative h-1 rounded-full overflow-hidden bg-white/5">
              {/* Progress fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${progress}%` }}
              >
                {/* Gradient fill */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, oklch(0.55 0.26 25), oklch(0.65 0.22 40), oklch(0.75 0.18 55), oklch(0.8 0.14 70))",
                  }}
                />
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    boxShadow: "0 0 20px oklch(0.55 0.24 25 / 0.8), 0 0 40px oklch(0.65 0.2 40 / 0.4)",
                  }}
                />
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.4), transparent)",
                    width: "50%",
                  }}
                />
                {/* Leading edge glow */}
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{
                    background: "oklch(0.9 0.12 70)",
                    boxShadow: "0 0 15px oklch(0.8 0.14 70), 0 0 30px oklch(0.8 0.14 70 / 0.5)",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress percentage */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <motion.span
                className="text-xs font-mono tracking-widest"
                style={{
                  background: "linear-gradient(90deg, oklch(0.55 0.24 25), oklch(0.72 0.16 70))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {Math.round(progress)}%
              </motion.span>
              <motion.span
                className="text-[10px] tracking-[0.3em] text-muted-foreground/60 uppercase"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {phase === "reveal" ? "Ready" : "Loading"}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>

        {/* Elegant corner frames */}
        {[
          { pos: "top-6 left-6", border: "border-l-2 border-t-2", rounded: "rounded-tl-2xl", delay: 1.2 },
          { pos: "top-6 right-6", border: "border-r-2 border-t-2", rounded: "rounded-tr-2xl", delay: 1.3 },
          { pos: "bottom-6 left-6", border: "border-l-2 border-b-2", rounded: "rounded-bl-2xl", delay: 1.4 },
          { pos: "bottom-6 right-6", border: "border-r-2 border-b-2", rounded: "rounded-br-2xl", delay: 1.5 },
        ].map((corner, i) => (
          <motion.div
            key={i}
            className={`absolute ${corner.pos} w-16 h-16 ${corner.border} ${corner.rounded}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: corner.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              borderColor: "oklch(0.55 0.24 25 / 0.25)",
            }}
          >
            {/* Corner accent dot */}
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.55 0.24 25)",
                boxShadow: "0 0 10px oklch(0.55 0.24 25 / 0.5)",
                ...(i === 0 ? { top: -1, left: -1 } : {}),
                ...(i === 1 ? { top: -1, right: -1 } : {}),
                ...(i === 2 ? { bottom: -1, left: -1 } : {}),
                ...(i === 3 ? { bottom: -1, right: -1 } : {}),
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          </motion.div>
        ))}

        {/* Subtle vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, oklch(0.05 0.01 30 / 0.4) 100%)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
