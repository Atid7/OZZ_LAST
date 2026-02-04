"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/translations";
import { Category } from "@/lib/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  language: Language;
}

export function CategoryNav({ categories, activeCategory, onCategoryChange, language }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeButton = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const scrollLeft =
        buttonRect.left - containerRect.left - containerRect.width / 2 + buttonRect.width / 2 + container.scrollLeft;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto">
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto hide-scrollbar py-3.5 px-4"
        >
          <div className="flex gap-2 mx-auto md:mx-0">
            {categories.map((category) => {
              const isActive = category.id === activeCategory;
              const name = language === "en" ? category.nameEn : category.nameFr;

              return (
                <button
                  key={category.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "relative px-4 py-2 whitespace-nowrap transition-all duration-300 font-medium text-base rounded-full",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
