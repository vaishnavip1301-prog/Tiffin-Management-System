import { kitchenAxiosInstance } from "./axiosInstance";

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
  const response = await kitchenAxiosInstance.get<MenuCategory[]>(
    "/GetMenuCategories"
  );

  console.log("Menu Categories API response:", response.data);
  return response.data;
};

// GET: Menu Category By ID
export const getMenuCategoryById = async (
  id: string
): Promise<MenuCategory> => {
  const response = await kitchenAxiosInstance.get<MenuCategory>(
    `/GetMenuCategory/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Create Menu Category
export const createMenuCategory = async (
  data: MenuCategoryInput
): Promise<MenuCategory> => {
  const response = await kitchenAxiosInstance.post<MenuCategory>(
    "/CreateMenuCategory",
    data
  );

  return response.data;
};

// PUT: Update Menu Category
export const updateMenuCategory = async (
  id: string,
  data: MenuCategoryInput
): Promise<MenuCategory> => {
  const response = await kitchenAxiosInstance.put<MenuCategory>(
    "/UpdateMenuCategory",
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
  await kitchenAxiosInstance.delete(
    `/DeleteMenuCategory/${encodeURIComponent(id)}`
  );
};
