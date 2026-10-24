import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

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
  const response = await axios.get<MealType[]>(`${API_URL}/MealType`);
  return response.data;
}

export async function getMealTypeById(id: string): Promise<MealType> {
  const response = await axios.get<MealType>(
    `${API_URL}/MealType/${encodeURIComponent(id)}`
  );
  return response.data;
}

export async function createMealType(
  data: MealTypeInput
): Promise<MealType> {
  const response = await axios.post<MealType>(`${API_URL}/MealType`, data);
  return response.data;
}

export async function updateMealType(
  id: string,
  data: MealTypeInput
): Promise<MealType> {
  const response = await axios.put<MealType>(
    `${API_URL}/MealType/${encodeURIComponent(id)}`,
    data
  );
  return response.data;
}

export async function deleteMealType(id: string): Promise<void> {
  await axios.delete(`${API_URL}/MealType/${encodeURIComponent(id)}`);
}
