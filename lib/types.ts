
// ----- Types -----
export interface BaseModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// ----- Sauce & Cheese Enums (must match backend Prisma schema) -----
export type SauceType =
  | "MUSTARD"
  | "SOY_SAUCE"
  | "MAYONNAISE"
  | "BARBECUE"
  | "KETCHUP"
  | "HOT_SAUCE"
  | "RANCH"
  | "HONEY_MUSTARD"
  | "SWEET_CHILI"
  | "GARLIC_AIOLI"
  | "OTHER";

export type CheeseType =
  | "CHEDDAR"
  | "MOZZARELLA"
  | "PARMESAN"
  | "BLUE_CHEESE"
  | "GOAT_CHEESE"
  | "SWISS"
  | "FETA"
  | "CREAM_CHEESE"
  | "PROVOLONE"
  | "OTHER";

// ----- Sauce & Cheese Interfaces -----
export interface MenuItemSauce extends BaseModel {
  menuItemId: string;
  sauceType: SauceType;
  customName?: string; // Required when sauceType is OTHER
  isIncluded?: boolean;
  extraCost?: number;
}

export interface MenuItemSauceInput {
  // No menuItemId, no id, no createdAt, no updatedAt
  sauceType: SauceType;
  customName?: string;
  isIncluded?: boolean;
  extraCost?: number;
}

export interface MenuItemCheese extends BaseModel {
  menuItemId: string;
  cheeseType: CheeseType;
  customName?: string; // Required when cheeseType is OTHER
  isIncluded?: boolean;
  extraCost?: number;
}

export interface MenuItemCheeseInput {
  // No menuItemId, no id, no createdAt, no updatedAt
  cheeseType: CheeseType;
  customName?: string;
  isIncluded?: boolean;
  extraCost?: number;
}

// ----- Selected Options for Cart -----
export interface SelectedSauce {
  sauceType: SauceType;
  customName?: string;
  extraCost: number;
}

export interface SelectedCheese {
  cheeseType: CheeseType;
  customName?: string;
  extraCost: number;
}

export interface MenuItem extends BaseModel {
  restaurantId: string;
  categoryId: string;
  nameEn?: string;
  nameFr?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  price: number;
  image?: string | null;
  available?: boolean;
  isActive?: boolean;
  isChefRecommendation?: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  sauces?: MenuItemSauce[];
  cheeses?: MenuItemCheese[];
}

export interface MenuItemInput extends Omit<MenuItem, 'id' | 'sauces' | 'cheeses' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  sauces?: MenuItemSauceInput[];   // ← Input type without IDs
  cheeses?: MenuItemCheeseInput[]; // ← Input type without IDs
}

export interface Category extends BaseModel {
  restaurantId: string;
  nameEn?: string;
  nameFr?: string;
  nameAr?: string;
  icon?: string;
  visible: boolean;
  order: number;
  isActive: boolean;
}

export interface MenuData {
  restaurant: any;
  categories: Category[];
  menuItems: MenuItem[];
  storyCards: any[];
}
export interface MenuCategoryWithItems extends Category {
  items: MenuItem[];
}
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
export interface Schedule extends BaseModel {
  dayOfWeek: DayOfWeek
  opensAt: string        // "08:00"
  closesAt: string       // "23:00"
  isClosed: boolean
}
export interface Restaurant extends BaseModel {
  slug: string;
  name: string;
  phone: string | null;
  logo: string | null;
  heroImage: string | null;
  schedules: Schedule[];
  description?: string;
  tagline: string | null;
  story: string | null;
  isActive: boolean;
  currency?: string;
  menuBaseUrl?:string
}
