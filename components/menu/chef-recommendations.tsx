"use client";

import { useState } from "react";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { type Language } from "@/lib/translations";
import { MenuItemCard } from "./menu-item-card";
import { ItemDetailModal } from "./item-detail-modal";
import { MenuItem } from "@/lib/types";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/contexts/modal-context";

interface ChefRecommendationsProps {
  items: MenuItem[];
  language: Language;
}

export function ChefRecommendations({
  items,
  language,
}: ChefRecommendationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        
        const cardWidth = 320;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.min(newIndex, items.length - 1));
      }
    };

    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => scrollEl?.removeEventListener('scroll', checkScroll);
  }, [items.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    openModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    closeModal();
    setTimeout(() => setSelectedItem(null), 200);
  };

  if (items.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
                {language === "fr" ? "LES PLUS POPULAIRES" : "MOST POPULAR"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === "fr" ? "Les favoris de nos clients" : "Customer favorites"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-9 h-9 rounded-full border border-border/50 flex items-center justify-center transition-all duration-300",
                canScrollLeft 
                  ? "bg-card hover:bg-foreground hover:text-background hover:border-foreground" 
                  : "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-9 h-9 rounded-full border border-border/50 flex items-center justify-center transition-all duration-300",
                canScrollRight 
                  ? "bg-card hover:bg-foreground hover:text-background hover:border-foreground" 
                  : "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Carousel */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 pb-4 px-4 md:px-[max(1rem,calc((100vw-1280px)/2+1rem))] hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[260px] md:w-[280px] snap-start animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <MenuItemCard 
                item={item} 
                language={language} 
                variant="featured"
                onItemClick={handleItemClick}
              />
            </div>
          ))}
        </div>

        {/* Mobile gradient edges */}
        <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
        <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Mobile Progress Dots */}
      <div className="flex justify-center mt-3 gap-1.5 md:hidden">
        {items.slice(0, Math.min(items.length, 6)).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (scrollRef.current) {
                const scrollAmount = 260 * index;
                scrollRef.current.scrollTo({
                  left: scrollAmount,
                  behavior: 'smooth'
                });
              }
            }}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === activeIndex 
                ? "w-5 bg-foreground" 
                : "w-1 bg-border hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        language={language}
      />
    </section>
  );
}
