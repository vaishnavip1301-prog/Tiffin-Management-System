import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

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
  const response = await axios.get<City[]>(
    `${API_URL}/Cities`
  );

  return response.data;
};

// GET: Cities by State ID
export const getCitiesByState = async (
  stateId: string
): Promise<City[]> => {
  const response = await axios.get<City[]>(
    `${API_URL}/CitiesByState/${stateId}`
  );

  return response.data;
};

// GET: City by ID
export const getCityById = async (
  id: string
): Promise<City> => {
  const response = await axios.get<City>(
    `${API_URL}/City/${id}`
  );

  return response.data;
};

// POST: Add City
export const addCity = async (
  data: CityInput
): Promise<City> => {
  const response = await axios.post<City>(
    `${API_URL}/AddCity`,
    data
  );

  return response.data;
};

// PUT: Update City
export const updateCity = async (
  id: string,
  data: CityInput
): Promise<City> => {
  const response = await axios.put<City>(
    `${API_URL}/UpdateCity/${id}`,
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
  await axios.delete(
    `${API_URL}/DeleteCity/${id}`
  );
};
