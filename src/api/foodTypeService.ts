
import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

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
  const response = await axios.get<FoodType[]>(
    `${API_URL}/FoodType`
  );

  return response.data;
};

// GET: Food Type by ID
export const getFoodTypeById = async (
  id: string
): Promise<FoodType> => {
  const response = await axios.get<FoodType>(
    `${API_URL}/FoodType/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Create Food Type
export const createFoodType = async (
  data: FoodTypeInput
): Promise<FoodType> => {
  const response = await axios.post<FoodType>(
    `${API_URL}/FoodType`,
    data
  );

  return response.data;
};

// PUT: Update Food Type
export const updateFoodType = async (
  id: string,
  data: FoodTypeInput
): Promise<FoodType> => {
  const response = await axios.put<FoodType>(
    `${API_URL}/FoodType/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
};

// DELETE: Delete Food Type
export const deleteFoodType = async (
  id: string
): Promise<void> => {
  await axios.delete(
    `${API_URL}/FoodType/${encodeURIComponent(id)}`
  );
};
