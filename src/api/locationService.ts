import { kitchenAxiosInstance } from "./axiosInstance";

export interface Location {
  id: string;
  areaId: string;
  areaName: string;
  cityName: string;
  stateName: string;
  postalCode: string;
  addressLine: string;
  landmark: string | null;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface LocationInput {
  areaId: string;
  postalCode: string;
  addressLine: string;
  landmark: string | null;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

// GET: All Locations
export const getLocations = async (): Promise<Location[]> => {
  const response = await kitchenAxiosInstance.get<Location[]>(
    "/Locations"
  );

  return response.data;
};

// GET: Locations by Area ID
export const getLocationsByArea = async (
  areaId: string
): Promise<Location[]> => {
  const response = await kitchenAxiosInstance.get<Location[]>(
    `/LocationsByArea/${encodeURIComponent(areaId)}`
  );

  return response.data;
};

// GET: Location by ID
export const getLocationById = async (
  id: string
): Promise<Location> => {
  const response = await kitchenAxiosInstance.get<Location>(
    `/Location/${encodeURIComponent(id)}`
  );

  return response.data;
};

// POST: Add Location
export const addLocation = async (
  location: LocationInput
): Promise<Location> => {
  const response = await kitchenAxiosInstance.post<Location>(
    "/AddLocation",
    location
  );

  return response.data;
};

// PUT: Update Location
export const updateLocation = async (
  location: Location
): Promise<Location> => {
  const response = await kitchenAxiosInstance.put<Location>(
    "/UpdateLocation",
    location
  );

  return response.data;
};

// DELETE: Delete Location
export const deleteLocation = async (
  id: string
): Promise<void> => {
  await kitchenAxiosInstance.delete(
    `/DeleteLocation/${encodeURIComponent(id)}`
  );
};
