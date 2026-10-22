
import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface MenuItem {
  id: string;
  kitchenId: string;
  menuCategoryId: string | null;
  categoryName?: string;
  name: string;
  description: string | null;
  mealType: number;
  price: number;
  currencyCode?: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl: string | null;
  isActive?: boolean;
}

export interface MenuItemsResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: MenuItem[];
}

export type MenuItemInput = Omit<MenuItem, "id">;

export type UpdateMenuItemInput = Omit<MenuItem, "kitchenId">;

// GET: Menu items with pagination
export const getMenuItems = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<MenuItemsResponse> => {
  const response = await axios.get<MenuItemsResponse | MenuItem[]>(
    `${API_URL}/GetMenuItems`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    }
  );

  console.log("Menu Items API response:", response.data);

  const data = response.data;

  // API returns a direct array
  if (Array.isArray(data)) {
    return {
      pageNumber,
      pageSize,
      totalRecords: data.length,
      items: data,
    };
  }

  // API returns paginated data
  if (data && Array.isArray(data.items)) {
    return {
      pageNumber: data.pageNumber ?? pageNumber,
      pageSize: data.pageSize ?? pageSize,
      totalRecords: data.totalRecords ?? data.items.length,
      items: data.items,
    };
  }

  return {
    pageNumber,
    pageSize,
    totalRecords: 0,
    items: [],
  };
};

// GET: Menu item by ID
export const getMenuItemById = async (
  id: string
): Promise<MenuItem> => {
  const response = await axios.get<MenuItem>(
    `${API_URL}/GetMenuItem/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Create menu item
export const createMenuItem = async (
  data: MenuItemInput
): Promise<MenuItem> => {
  const response = await axios.post<MenuItem>(
    `${API_URL}/CreateMenuItem`,
    data
  );

  return response.data;
};

// PUT: Update menu item
export const updateMenuItem = async (
  data: UpdateMenuItemInput
): Promise<MenuItem> => {
  const response = await axios.put<MenuItem>(
    `${API_URL}/UpdateMenuItem`,
    data
  );

  return response.data;
};

// DELETE: Delete menu item by ID
export const deleteMenuItem = async (
  id: string
): Promise<void> => {
  await axios.delete(
    `${API_URL}/DeleteMenuItem/${encodeURIComponent(id)}`
  );
};
