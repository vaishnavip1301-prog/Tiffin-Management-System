import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface MenuItem {
  id: string;
  kitchenId: string;
  kitchenName?: string;
  menuCategoryId: string;
  categoryName?: string;
  menuSubCategoryId?: string;
  subCategoryName?: string;
  mealTypeId?: string;
  mealTypeName?: string;
  foodTypeId?: string;
  foodTypeName?: string;
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl: string | null;
  isActive?: boolean;
}

export interface MenuItemInput {
  kitchenId: string;
  menuCategoryId: string;
  menuSubCategoryId: string;
  mealTypeId: string;
  foodTypeId: string;
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl: string;
}

interface MenuItemApiResponse {
  items?: MenuItem[];
  data?: MenuItem[];
  records?: MenuItem[];
  totalRecords?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

const MENU_ITEM_ENDPOINT = `${API_URL}/GetMenuItems`;

function normalizeResponse(response: unknown): {
  items: MenuItem[];
  totalRecords: number;
  totalPages: number;
} {
  if (Array.isArray(response)) {
    return {
      items: response as MenuItem[],
      totalRecords: response.length,
      totalPages: 1,
    };
  }

  const result = (response ?? {}) as MenuItemApiResponse;
  const items = result.items ?? result.data ?? result.records ?? [];

  return {
    items,
    totalRecords: result.totalRecords ?? items.length,
    totalPages:
      result.totalPages ??
      (items.length > 0 ? 1 : 0),
  };
}

// GET: Get Menu Items
export async function getMenuItems(
  pageNumber = 1,
  pageSize = 10
): Promise<{
  items: MenuItem[];
  totalRecords: number;
  totalPages: number;
}> {
  const response = await axios.get(MENU_ITEM_ENDPOINT, {
    params: {
      pageNumber,
      pageSize,
    },
  });

  console.log("Menu Items API response:", response.data);

  return normalizeResponse(response.data);
}

// GET: Get All Menu Items
export async function getAllMenuItems(): Promise<MenuItem[]> {
  const firstPage = await getMenuItems(1, 100);
  const allItems = [...firstPage.items];

  if (
    firstPage.totalPages <= 1 ||
    allItems.length >= firstPage.totalRecords
  ) {
    return allItems;
  }

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const result = await getMenuItems(page, 100);

    allItems.push(...result.items);

    if (result.items.length === 0) {
      break;
    }
  }

  return allItems;
}

// GET: Get Menu Item By ID
export async function getMenuItemById(
  id: string
): Promise<MenuItem> {
  const response = await axios.get(
    `${API_URL}/GetMenuItem/${id}`
  );

  return response.data;
}

// CREATE: Create Menu Item
export async function createMenuItem(
  data: MenuItemInput
): Promise<unknown> {
  const response = await axios.post(
    `${API_URL}/CreateMenuItem`,
    data
  );

  return response.data;
}

// UPDATE: Update Menu Item using ID
export async function updateMenuItem(
  id: string,
  data: MenuItemInput
): Promise<unknown> {
  const response = await axios.put(
    `${API_URL}/UpdateMenuItem`,
    {
      ...data,
      id,
    }
  );

  return response.data;
}

// DELETE: Delete Menu Item using ID
export async function deleteMenuItem(
  id: string
): Promise<unknown> {
  const response = await axios.delete(
    `${API_URL}/DeleteMenuItem/${id}`
  );

  return response.data;
}
