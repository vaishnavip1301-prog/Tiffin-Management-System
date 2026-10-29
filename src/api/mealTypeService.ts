import { kitchenAxiosInstance } from "./axiosInstance";

export interface MealType {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
}

export interface MealTypeInput {
  name: string;
  description: string | null;
  displayOrder: number;
}

export async function getMealTypes(): Promise<MealType[]> {
  const response = await kitchenAxiosInstance.get<MealType[]>("/MealType");
  return response.data;
}

export async function getMealTypeById(id: string): Promise<MealType> {
  const response = await kitchenAxiosInstance.get<MealType>(
    `/MealType/${encodeURIComponent(id)}`
  );
  return response.data;
}

export async function createMealType(
  data: MealTypeInput
): Promise<MealType> {
  const response = await kitchenAxiosInstance.post<MealType>("/MealType", data);
  return response.data;
}

export async function updateMealType(
  id: string,
  data: MealTypeInput
): Promise<MealType> {
  const response = await kitchenAxiosInstance.put<MealType>(
    `/MealType/${encodeURIComponent(id)}`,
    data
  );
  return response.data;
}

export async function deleteMealType(id: string): Promise<void> {
  await kitchenAxiosInstance.delete(`/MealType/${encodeURIComponent(id)}`);
}
