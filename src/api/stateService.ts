import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

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
  const response = await axios.get<State[]>(
    `${API_URL}/States`
  );

  return response.data;
};

// GET: Get State by ID
export const getStateById = async (
  id: string
): Promise<State> => {
  const response = await axios.get<State>(
    `${API_URL}/State/${id}`
  );

  return response.data;
};

// POST: Add State
export const addState = async (
  id: string,
  data: StateInput
): Promise<State> => {
  const response = await axios.post<State>(
    `${API_URL}/AddState/${id}`,
    data
  );

  return response.data;
};

// PUT: Update State
export const updateState = async (
  id: string,
  data: StateInput
): Promise<State> => {
  const response = await axios.put<State>(
    `${API_URL}/UpdateState/${id}`,
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
  await axios.delete(
    `${API_URL}/DeleteState/${id}`
  );
};
