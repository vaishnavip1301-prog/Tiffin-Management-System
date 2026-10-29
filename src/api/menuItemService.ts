import { kitchenAxiosInstance } from "./axiosInstance";

/* =========================
   TYPES
========================= */

export interface MenuItem {
  id: string;
  kitchenId: string;
  menuCategoryId: string;
  categoryName: string;
  menuSubCategoryId: string;
  subCategoryName: string;
  name: string;
  description: string | null;
  mealTypeId: string;
  mealTypeName: string;
  foodTypeId: string;
  foodTypeName: string;
  dietaryTagNames: string[];
  price: number;
  currencyCode: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
}

export interface MenuItemInput {
  kitchenId: string;
  menuCategoryId: string;
  menuSubCategoryId: string;
  name: string;
  description: string;
  mealTypeId: string;
  foodTypeId: string;
  dietaryTagIds: string[];
  price: number;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl?: string;
}

export interface MenuItemsResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  items: MenuItem[];
}

/* =========================
   GET ALL MENU ITEMS
========================= */

export const getMenuItems = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<MenuItemsResponse> => {
  const response = await kitchenAxiosInstance.get("/GetMenuItems", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  return response.data;
};

/* =========================
   GET MENU ITEM BY ID
========================= */

export const getMenuItemById = async (
  id: string
): Promise<MenuItem> => {
  const response = await kitchenAxiosInstance.get(
    `/GetMenuItem/${id}`
  );

  return response.data;
};

/* =========================
   CREATE MENU ITEM
========================= */

export const createMenuItem = async (
  data: MenuItemInput
): Promise<unknown> => {
  const response = await kitchenAxiosInstance.post(
    "/CreateMenuItem",
    data
  );

  return response.data;
};

/* =========================
   UPDATE MENU ITEM
========================= */

export const updateMenuItem = async (
  data: MenuItemInput
): Promise<unknown> => {
  const response = await kitchenAxiosInstance.put(
    "/UpdateMenuItem",
    data
  );

  return response.data;
};

/* =========================
   DELETE MENU ITEM
========================= */

export const deleteMenuItem = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(`/DeleteMenuItem/${id}`);
};
