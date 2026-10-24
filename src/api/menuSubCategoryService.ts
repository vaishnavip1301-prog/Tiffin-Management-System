
import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface MenuSubCategory {
  id: string;
  menuCategoryId: string;
  menuCategoryName: string;
  kitchenId: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface MenuSubCategoryInput {
  name: string;
  description: string | null;
  displayOrder: number;
  menuCategoryId: string;
}

// GET: All Menu Sub Categories
export async function getMenuSubCategories(): Promise<
  MenuSubCategory[]
> {
  const response = await axios.get<MenuSubCategory[]>(
    `${API_URL}/MenuSubCategories`
  );

  return response.data;
}

// GET: Menu Sub Categories by Menu Category ID
export async function getMenuSubCategoriesByCategory(
  menuCategoryId: string
): Promise<MenuSubCategory[]> {
  const response = await axios.get<MenuSubCategory[]>(
    `${API_URL}/MenuSubCategoriesByCategory/${encodeURIComponent(
      menuCategoryId
    )}`
  );

  return response.data;
}

// GET: Menu Sub Category by ID
export async function getMenuSubCategoryById(
  id: string
): Promise<MenuSubCategory> {
  const response = await axios.get<MenuSubCategory>(
    `${API_URL}/MenuSubCategory/${encodeURIComponent(id)}`
  );

  return response.data;
}

// POST: Create Menu Sub Category
export async function createMenuSubCategory(
  data: MenuSubCategoryInput
): Promise<MenuSubCategory> {
  const response = await axios.post<MenuSubCategory>(
    `${API_URL}/AddMenuSubCategory`,
    data
  );

  return response.data;
}

// PUT: Update Menu Sub Category
export async function updateMenuSubCategory(
  data: MenuSubCategoryInput
): Promise<MenuSubCategory> {
  const response = await axios.put<MenuSubCategory>(
    `${API_URL}/UpdateMenuSubCategory`,
    data
  );

  return response.data;
}

// DELETE: Delete Menu Sub Category
export async function deleteMenuSubCategory(
  id: string
): Promise<void> {
  await axios.delete(
    `${API_URL}/DeleteMenuSubCategory/${encodeURIComponent(id)}`
  );
}
