import axios from "axios";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

export interface Kitchen {
  id: string;
  name: string;
  description: string | null;
  ownerName: string | null;
  phoneNumber: string | null;
  email: string | null;
  addressLine: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  currencyCode?: string;
  isActive?: boolean;
}

export type KitchenInput = Omit<Kitchen, "id">;

// GET: Get Kitchen data
export const getKitchen = async (): Promise<
  Kitchen | Kitchen[]
> => {
  const response = await axios.get<Kitchen | Kitchen[]>(
    `${API_URL}/GetKitchen`
  );

  console.log("Kitchen API response:", response.data);

  return response.data;
};

// CREATE: Create Kitchen
export const createKitchen = async (
  data: KitchenInput
): Promise<Kitchen> => {
  const response = await axios.post<Kitchen>(
    `${API_URL}/CreateKitchen`,
    data
  );

  return response.data;
};

// UPDATE: Update Kitchen using ID
export const updateKitchen = async (
  id: string,
  data: KitchenInput
): Promise<Kitchen> => {
  const response = await axios.put<Kitchen>(
    `${API_URL}/UpdateKitchen`,
    {
      ...data,
      id: id,
    }
  );

  return response.data;
};
