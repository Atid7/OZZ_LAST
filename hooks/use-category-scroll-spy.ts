import { useEffect } from "react";
import type { MenuCategoryWithItems } from "@/lib/types";

/**
 * Hook to manage category intersection observer for scroll spy
 */
export function useCategoryScrollSpy(
  categories: MenuCategoryWithItems[],
  onCategoryChange: (categoryId: string) => void
) {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((category) => {
      const section = document.getElementById(category.id);
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onCategoryChange(category.id);
            }
          });
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [categories, onCategoryChange]);
}
