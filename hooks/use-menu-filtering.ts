import { useMemo } from "react";
import type { Category, MenuItem, MenuCategoryWithItems } from "@/lib/types";

/**
 * Combines categories with their items
 */
function buildCategoryMenuData(
  categories: Category[],
  menuItems: MenuItem[]
): MenuCategoryWithItems[] {
  return categories
    .map((category) => {
      const categoryItems = menuItems.filter(
        (item) =>
          item.categoryId === category.id && item.isActive && item.available
      );

      return {
        ...category,
        items: categoryItems,
      };
    })
    .filter((category) => category.items.length > 0);
}

/**
 * Hook to filter and organize menu data
 */
export function useMenuFiltering(
  categories: Category[],
  menuItems: MenuItem[]
) {
  const chefRecommendations = useMemo(() => {
    return menuItems.filter(
      (item) => item.isActive && item.available && item.isChefRecommendation
    );
  }, [menuItems]);

  const filteredCategories = useMemo(() => {
    return buildCategoryMenuData(categories, menuItems);
  }, [categories, menuItems]);

  return { chefRecommendations, filteredCategories };
}