import { kitchenAxiosInstance } from "./axiosInstance";

export interface DietaryTag {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface DietaryTagInput {
  name: string;
  description: string | null;
  displayOrder: number;
}

// GET: All dietary tags
export async function getDietaryTags(): Promise<DietaryTag[]> {
  const response = await kitchenAxiosInstance.get<DietaryTag[]>(
    "/DietaryTag"
  );
  return response.data;
}

// GET: Dietary tag by ID
export async function getDietaryTagById(
  id: string
): Promise<DietaryTag> {
  const response = await kitchenAxiosInstance.get<DietaryTag>(
    `/DietaryTag/${encodeURIComponent(id)}`
  );
  return response.data;
}

// POST: Create dietary tag
export async function createDietaryTag(
  data: DietaryTagInput
): Promise<DietaryTag> {
  const response = await kitchenAxiosInstance.post<DietaryTag>(
    "/DietaryTag",
    data
  );
  return response.data;
}

// PUT: Update dietary tag by ID
export async function updateDietaryTag(
  id: string,
  data: DietaryTagInput
): Promise<DietaryTag> {
  const response = await kitchenAxiosInstance.put<DietaryTag>(
    `/DietaryTag/${encodeURIComponent(id)}`,
    data
  );
  return response.data;
}

// DELETE: Delete dietary tag by ID
export async function deleteDietaryTag(
  id: string
): Promise<void> {
  await kitchenAxiosInstance.delete(
    `/DietaryTag/${encodeURIComponent(id)}`
  );
}
