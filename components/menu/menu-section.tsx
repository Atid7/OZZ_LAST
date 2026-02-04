"use client";

import { useState } from "react";
import { translations, type Language } from "@/lib/translations";
import { MenuItemCard } from "./menu-item-card";
import { ItemDetailModal } from "./item-detail-modal";
import { MenuCategoryWithItems, MenuItem } from "@/lib/types";
import { useModal } from "@/contexts/modal-context";

interface MenuSectionProps {
  category: MenuCategoryWithItems;
  language: Language;
}

export function MenuSection({ category, language }: MenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal, closeModal } = useModal();

  const name = language === "fr" ? category.nameFr : category.nameEn;
  const t = translations[language];

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

  return (
    <section id={category.id} className="py-8 md:py-10 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-wide uppercase">
              {name}
            </h2>
            <p className="text-base text-muted-foreground mt-1">
              {category.items.length} {t.items}
            </p>
          </div>
        </div>

        {/* Menu items grid - Responsive grid like Uber Eats/DoorDash */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {category.items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MenuItemCard 
                item={item} 
                language={language} 
                onItemClick={handleItemClick}
              />
            </div>
          ))}
        </div>
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
