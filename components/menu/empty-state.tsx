"use client"

import { Search, UtensilsCrossed } from "lucide-react"
import { type Language, translations } from "@/lib/translations"

interface EmptyStateProps {
  language: Language
}

export function EmptyState({ language }: EmptyStateProps) {
  const t = translations[language]

  return (
    <div className="flex flex-col items-center justify-center py-28 px-6 relative">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.06) 0%, transparent 70%)",
        }}
      />
      
      <div className="text-center relative animate-fade-in-up">
        {/* Icon container with glow */}
        <div className="relative mb-8">
          <div 
            className="absolute inset-0 -m-4 rounded-full blur-2xl"
            style={{
              background: "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.2) 0%, transparent 70%)",
            }}
          />
          <div className="relative w-24 h-24 glass-card rounded-2xl flex items-center justify-center mx-auto">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        {/* Message */}
        <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-wider uppercase mb-4">
          {t.noResults}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mb-8">
          {t.tryDifferent}
        </p>
        
        {/* Suggestion pill */}
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-card">
          <UtensilsCrossed className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-wider text-foreground/80">
            {language === "fr" ? "Essayez un autre terme" : "Try a different search"}
          </span>
        </div>
      </div>
    </div>
  )
}
