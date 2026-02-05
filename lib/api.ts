export const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

/* ===========================
   HELPER: Convert Prisma Decimal to number
   =========================== */
function normalizeMenuData(menuData: any) {
  if (!menuData) return menuData;

  // Normalize menu items
  if (menuData.menuItems && Array.isArray(menuData.menuItems)) {
    menuData.menuItems = menuData.menuItems.map((item: any) => {
      // Convert price from Decimal/string to number
      let normalizedPrice: number;
      if (typeof item.price === 'number') {
        normalizedPrice = item.price;
      } else if (typeof item.price === 'string') {
        normalizedPrice = parseFloat(item.price);
      } else if (item.price && typeof item.price === 'object') {
        // Prisma Decimal is an object - convert to string first, then parse
        normalizedPrice = parseFloat(item.price.toString());
      } else {
        normalizedPrice = 0;
      }

      return {
        ...item,
        price: normalizedPrice,
        // Normalize sauces if present
        sauces: item.sauces?.map((sauce: any) => ({
          ...sauce,
          extraCost: typeof sauce.extraCost === 'number'
            ? sauce.extraCost
            : sauce.extraCost && typeof sauce.extraCost === 'object'
              ? parseFloat(sauce.extraCost.toString())
              : parseFloat(String(sauce.extraCost || 0)),
        })),
        // Normalize cheeses if present
        cheeses: item.cheeses?.map((cheese: any) => ({
          ...cheese,
          extraCost: typeof cheese.extraCost === 'number'
            ? cheese.extraCost
            : cheese.extraCost && typeof cheese.extraCost === 'object'
              ? parseFloat(cheese.extraCost.toString())
              : parseFloat(String(cheese.extraCost || 0)),
        })),
      };
    });
  }

  return menuData;
}

export async function fetchMenu(slug: string) {
  try {
    // Check if API_URL is configured
    if (!API_URL) {
      console.error('NEXT_PUBLIC_ADMIN_API_URL environment variable is not set');
      throw new Error(
        'API URL is not configured. Please set NEXT_PUBLIC_ADMIN_API_URL environment variable in Vercel dashboard.'
      );
    }

    const url = `${API_URL}/api/public/menu/${slug}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Normalize prices from Decimal to number
    const normalizedData = normalizeMenuData(data.data);

    return normalizedData;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/* ===========================
   CREATE PUBLIC ORDER
   =========================== */

export interface CreateOrderPayload {
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    selectedSauces?: Array<{
      sauceType: string;
      customName?: string;
    }>;
    selectedCheeses?: Array<{
      cheeseType: string;
      customName?: string;
    }>;
  }[];
}

export async function createOrder(
  slug: string,
  payload: CreateOrderPayload
) {
  try {
    console.log('📤 Sending order to backend:', {
      url: `${API_URL}/api/public/order/${slug}`,
      payload
    });

    const res = await fetch(
      `${API_URL}/api/public/order/${slug}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log('📥 Backend response status:', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response (raw):', errorText);
      console.error('❌ HTTP Status:', res.status);

      let errorMessage = "Failed to create order";

      try {
        const errorJson = JSON.parse(errorText);
        console.error('❌ Error response (parsed):', errorJson);
        errorMessage = errorJson?.error?.message || errorJson?.message || errorJson?.error || errorMessage;
      } catch (parseError) {
        console.error('❌ Could not parse error response as JSON');
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log('✅ Order created successfully:', data);
    return data.data;
  } catch (error) {
    console.error('💥 Order API error:', error);
    throw error;
  }
}

