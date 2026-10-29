import { kitchenAxiosInstance } from "./axiosInstance";

export interface Kitchen {
  id: string;
  name: string;
  description: string | null;
  ownerName: string | null;
  phoneNumber: string | null;
  email: string | null;
  locationId: string | null;
  locationAddressLine?: string | null;
  locationLandmark?: string | null;
  locationAreaName?: string | null;
  locationCityName?: string | null;
  locationStateName?: string | null;
  locationPostalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  currencyCode: string;
  isActive: boolean;
}

export type KitchenInput = Omit<Kitchen, "id">;

// GET: Get Kitchen
export const getKitchen = async (): Promise<Kitchen | Kitchen[]> => {
  const response = await kitchenAxiosInstance.get<Kitchen | Kitchen[]>(
    "/GetKitchen"
  );

  console.log("Kitchen GET response:", response.data);

  return response.data;
};

// UPDATE: Update Kitchen
export const updateKitchen = async (
  id: string,
  data: Partial<Kitchen>
): Promise<Kitchen> => {
  const response = await kitchenAxiosInstance.put<Kitchen>(
    "/UpdateKitchen",
    {
      id,
      ...data,
    }
  );

  console.log("Kitchen UPDATE response:", response.data);

  return response.data;
};
