import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface Area {
  id: string;
  cityId: string;
  cityName: string;
  stateName: string;
  name: string;
  postalCode: string;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface AreaInput {
  cityId: string;
  name: string;
  postalCode: string;
  isActive: boolean;
}

export const getAreas = async (): Promise<Area[]> => {
  const response = await axios.get<Area[]>(
    `${API_URL}/Areas`
  );

  return response.data;
};

export const getAreasByCity = async (
  cityId: string
): Promise<Area[]> => {
  const response = await axios.get<Area[]>(
    `${API_URL}/AreasByCity/${cityId}`
  );

  return response.data;
};

export const getAreaById = async (
  id: string
): Promise<Area> => {
  const response = await axios.get<Area>(
    `${API_URL}/Area/${id}`
  );

  return response.data;
};

export const addArea = async (
  data: AreaInput
): Promise<Area> => {
  const response = await axios.post<Area>(
    `${API_URL}/AddArea`,
    data
  );

  return response.data;
};

export const updateArea = async (
  id: string,
  data: AreaInput
): Promise<Area> => {
  const response = await axios.put<Area>(
    `${API_URL}/UpdateArea/${id}`,
    data
  );

  return response.data;
};

export const deleteArea = async (
  id: string
): Promise<void> => {
  await axios.delete(`${API_URL}/DeleteArea/${id}`);
};