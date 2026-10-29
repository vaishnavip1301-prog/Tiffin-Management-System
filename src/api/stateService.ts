import { kitchenAxiosInstance } from "./axiosInstance";

export interface State {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
}

export interface StateInput {
  name: string;
  code: string;
  isActive: boolean;
}

// GET: Get all States
export const getStates = async (): Promise<State[]> => {
  const response = await kitchenAxiosInstance.get<State[]>(
    "/States"
  );

  return response.data;
};

// GET: Get State by ID
export const getStateById = async (
  id: string
): Promise<State> => {
  const response = await kitchenAxiosInstance.get<State>(
    `/State/${id}`
  );

  return response.data;
};

// POST: Add State
export const addState = async (
  id: string,
  data: StateInput
): Promise<State> => {
  const response = await kitchenAxiosInstance.post<State>(
    `/AddState/${id}`,
    data
  );

  return response.data;
};

// PUT: Update State
export const updateState = async (
  id: string,
  data: StateInput
): Promise<State> => {
  const response = await kitchenAxiosInstance.put<State>(
    `/UpdateState/${id}`,
    {
      id,
      name: data.name,
      code: data.code,
      isActive: data.isActive,
    }
  );

  return response.data;
};

// DELETE: Delete State
export const deleteState = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(
    `/DeleteState/${id}`
  );
};