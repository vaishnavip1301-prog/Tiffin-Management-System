
import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  kitchenId: string;
  isActive: boolean;
}

export type MenuCategoryInput = Omit<MenuCategory, "id">;

// GET: All Menu Categories
export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  const response = await axios.get<MenuCategory[]>(
    `${API_URL}/GetMenuCategories`
  );

  console.log("Menu Categories API response:", response.data);
  return response.data;
};

// GET: Menu Category By ID
export const getMenuCategoryById = async (
  id: string
): Promise<MenuCategory> => {
  const response = await axios.get<MenuCategory>(
    `${API_URL}/GetMenuCategory/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Create Menu Category
export const createMenuCategory = async (
  data: MenuCategoryInput
): Promise<MenuCategory> => {
  const response = await axios.post<MenuCategory>(
    `${API_URL}/CreateMenuCategory`,
    data
  );

  return response.data;
};

// PUT: Update Menu Category
export const updateMenuCategory = async (
  id: string,
  data: MenuCategoryInput
): Promise<MenuCategory> => {
  const response = await axios.put<MenuCategory>(
    `${API_URL}/UpdateMenuCategory`,
    {
      id,
      ...data,
    }
  );

  return response.data;
};

// DELETE: Menu Category
export const deleteMenuCategory = async (
  id: string
): Promise<void> => {
  await axios.delete(
    `${API_URL}/DeleteMenuCategory/${encodeURIComponent(id)}`
  );
};
