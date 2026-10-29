import { kitchenAxiosInstance } from "./axiosInstance";

// City interface
export interface City {
  id: string;
  stateId: string;
  stateName: string;
  name: string;
  isActive: boolean;
  createdAtUtc?: string;
  updatedAtUtc?: string | null;
}

// City form data
export interface CityInput {
  name: string;
  stateId: string;
  isActive: boolean;
}

// GET: All Cities
export const getCities = async (): Promise<City[]> => {
  const response = await kitchenAxiosInstance.get<City[]>("/Cities");

  return response.data;
};

// GET: Cities by State ID
export const getCitiesByState = async (
  stateId: string
): Promise<City[]> => {
  const response = await kitchenAxiosInstance.get<City[]>(
    `/CitiesByState/${stateId}`
  );

  return response.data;
};

// GET: City by ID
export const getCityById = async (
  id: string
): Promise<City> => {
  const response = await kitchenAxiosInstance.get<City>(
    `/City/${id}`
  );

  return response.data;
};

// POST: Add City
export const addCity = async (
  data: CityInput
): Promise<City> => {
  const response = await kitchenAxiosInstance.post<City>(
    "/AddCity",
    data
  );

  return response.data;
};

// PUT: Update City
export const updateCity = async (
  id: string,
  data: CityInput
): Promise<City> => {
  const response = await kitchenAxiosInstance.put<City>(
    `/UpdateCity/${id}`,
    {
      id,
      name: data.name,
      stateId: data.stateId,
      isActive: data.isActive,
    }
  );

  return response.data;
};

// DELETE: Delete City
export const deleteCity = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(`/DeleteCity/${id}`);
};
