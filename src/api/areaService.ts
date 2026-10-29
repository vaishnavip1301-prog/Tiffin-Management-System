import { kitchenAxiosInstance } from "./axiosInstance";

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
  const response = await kitchenAxiosInstance.get<Area[]>("/Areas");

  return response.data;
};

export const getAreasByCity = async (
  cityId: string
): Promise<Area[]> => {
  const response = await kitchenAxiosInstance.get<Area[]>(
    `/AreasByCity/${cityId}`
  );

  return response.data;
};

export const getAreaById = async (
  id: string
): Promise<Area> => {
  const response = await kitchenAxiosInstance.get<Area>(
    `/Area/${id}`
  );

  return response.data;
};

export const addArea = async (
  data: AreaInput
): Promise<Area> => {
  const response = await kitchenAxiosInstance.post<Area>(
    "/AddArea",
    data
  );

  return response.data;
};

export const updateArea = async (
  id: string,
  data: AreaInput
): Promise<Area> => {
  const response = await kitchenAxiosInstance.put<Area>(
    `/UpdateArea/${id}`,
    data
  );

  return response.data;
};

export const deleteArea = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(`/DeleteArea/${id}`);
};
