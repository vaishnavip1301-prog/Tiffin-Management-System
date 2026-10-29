import { kitchenAxiosInstance } from "./axiosInstance";

export interface FoodType {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface FoodTypeInput {
  name: string;
  description: string | null;
  displayOrder: number;
}

// GET: All Food Types
export const getFoodTypes = async (): Promise<FoodType[]> => {
  const response = await kitchenAxiosInstance.get<FoodType[]>(
    "/FoodType"
  );

  return response.data;
};

// GET: Food Type by ID
export const getFoodTypeById = async (
  id: string
): Promise<FoodType> => {
  const response = await kitchenAxiosInstance.get<FoodType>(
    `/FoodType/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Create Food Type
export const createFoodType = async (
  data: FoodTypeInput
): Promise<FoodType> => {
  const response = await kitchenAxiosInstance.post<FoodType>(
    "/FoodType",
    data
  );

  return response.data;
};

// PUT: Update Food Type
export const updateFoodType = async (
  id: string,
  data: FoodTypeInput
): Promise<FoodType> => {
  const response = await kitchenAxiosInstance.put<FoodType>(
    `/FoodType/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
};

// DELETE: Delete Food Type
export const deleteFoodType = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(
    `/FoodType/${encodeURIComponent(id)}`
  );
};
