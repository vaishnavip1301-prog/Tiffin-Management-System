
import { cartAxiosInstance } from "./axiosInstance";

const GUEST_CART_TOKEN_KEY = "aaplaDabba_guestCartToken";

export interface CartItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
}

export interface CartItemQuantityUpdateDto {
  [key: string]: unknown;
}

export interface AdminUpdateCartRequest {
  id: string;
  expiresAtUtc: string | null;
  itemQuantities: CartItemQuantityUpdateDto[];
  status: number | null;
}


export interface CartItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  description: string | null;

  menuCategoryId: string;
  categoryName: string | null;

  menuSubCategoryId: string;
  subCategoryName: string | null;

  mealTypeId: string;
  mealTypeName: string | null;

  foodTypeId: string;
  foodTypeName: string | null;

  dietaryTagNames: string[];

  imageUrl: string | null;
  preparationTimeMinutes: number;

  unitPrice: number;
  quantity: number;
  lineTotal: number;
  currencyCode: string;
}

export interface CartResponse {
  cartId: string;
  status: string;
  currencyCode: string;
  expiresAtUtc: string;

  items: CartItem[];

  subtotal: number;
  totalQuantity: number;

  updatedAtUtc: string | null;
}

export interface AddCartResponse {
  cartId?: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  [key: string]: unknown;
}

function getResponseData<T>(responseData: unknown): T {
  let result = responseData;

  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "data" in result &&
    Object.keys(result).length === 1
  ) {
    result = (result as { data: unknown }).data;
  }

  return result as T;
}

export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

export function saveGuestCartToken(token: string): void {
  if (!token || !token.trim()) {
    throw new Error("Guest Cart Token is required.");
  }

  localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

export function clearGuestCartToken(): void {
  localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}

function getCartHeaders(token: string) {
  return {
    "X-Guest-Cart-Token": token,
  };
}

let createCartPromise: Promise<AddCartResponse> | null = null;

export async function createCart(): Promise<AddCartResponse> {
  if (createCartPromise) {
    return createCartPromise;
  }

  createCartPromise = (async () => {
    const response = await cartAxiosInstance.post("/AddCart");

    const data = getResponseData<AddCartResponse>(response.data);

    if (!data?.guestCartToken) {
      throw new Error(
        "Guest Cart Token was not returned by AddCart API."
      );
    }

    saveGuestCartToken(data.guestCartToken);

    console.log("Cart Created:", data);
    console.log("Saved Guest Token:", getGuestCartToken());

    return data;
  })();

  try {
    return await createCartPromise;
  } finally {
    createCartPromise = null;
  }
}


export async function ensureGuestCartToken(): Promise<string> {
  const existingToken = getGuestCartToken();

  if (existingToken) {
    return existingToken;
  }

  const cart = await createCart();

  if (!cart.guestCartToken) {
    throw new Error("Unable to create guest cart.");
  }

  return cart.guestCartToken;
}


export async function getCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<CartResponse>(response.data);
}


export async function getMyCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetMyCart", {
    headers: getCartHeaders(token),
  });

  const data = getResponseData<CartResponse>(response.data);

  console.log("GetMyCart Response:", data);

  return data;
}


export async function getCartItemById(
  cartItemId: string
): Promise<CartItem> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get(
    `/GetCartItemById/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getResponseData<CartItem>(response.data);
}


export async function associateGuestCart(
  requestBody: Record<string, unknown>
): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.post(
    "/AssociateGuestCart",
    requestBody,
    {
      headers: getCartHeaders(token),
    }
  );

  return getResponseData<unknown>(response.data);
}

export async function addCartItem(
  input: CartItemRequest
): Promise<CartResponse> {
  if (!input.menuItemId) {
    throw new Error("Menu Item ID is required.");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const token = await ensureGuestCartToken();

  const requestBody: CartItemRequest = {
    menuItemId: input.menuItemId,
    quantity: input.quantity,
  };

  const response = await cartAxiosInstance.post(
    "/AddCartItem",
    requestBody,
    {
      headers: getCartHeaders(token),
    }
  );

  console.log("Add Cart Item Response:", response.data);

  return await getMyCart();
}


export async function updateCartItemQty(
  cartItemId: string,
  quantity: number
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.put(
    `/UpdateCartItemQty/${encodeURIComponent(cartItemId)}`,
    { quantity },
    {
      headers: getCartHeaders(token),
    }
  );

  return await getMyCart();
}


export async function removeCartItem(
  cartItemId: string
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItem/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return await getMyCart();
}


export async function removeCartItemByMenuItemId(
  menuItemId: string
): Promise<CartResponse> {
  if (!menuItemId) {
    throw new Error("Menu Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItemById/${encodeURIComponent(menuItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return await getMyCart();
}

export async function deleteCart(): Promise<void> {
  const token = getGuestCartToken();

  if (!token) {
    return;
  }

  await cartAxiosInstance.delete("/DeleteCart", {
    headers: getCartHeaders(token),
  });

  clearGuestCartToken();
}

export async function deleteCartItem(): Promise<void> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete("/DeleteCartItem", {
    headers: getCartHeaders(token),
  });
}


export async function validateCart(): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/ValidateCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<unknown>(response.data);
}


export async function getAllCarts(): Promise<CartResponse[]> {
  const response = await cartAxiosInstance.get("/GetAllCarts");

  const data = getResponseData<CartResponse[]>(response.data);

  console.log("Get All Carts Response:", data);

  return data;
}


export async function getCartById(
  cartId: string
): Promise<CartResponse> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  const response = await cartAxiosInstance.get(
    `/GetCartById/${encodeURIComponent(cartId)}`
  );

  return getResponseData<CartResponse>(response.data);
}


export async function updateCart(
  cartId: string,
  requestBody: AdminUpdateCartRequest
): Promise<unknown> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  if (!requestBody.id) {
    throw new Error("Cart ID in request body is required.");
  }

  const response = await cartAxiosInstance.put(
    `/UpdateCart/${encodeURIComponent(cartId)}`,
    requestBody
  );

  console.log("Update Cart Response:", response.data);

  return getResponseData<unknown>(response.data);
}

// ADMIN: DELETE CART BY ID
// DELETE /Admin/DeleteCart/{cartId}
// =====================================================

export async function adminDeleteCart(
  cartId: string
): Promise<void> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  await cartAxiosInstance.delete(
    `/Admin/DeleteCart/${encodeURIComponent(cartId)}`
  );
}


export async function resetGuestCart(): Promise<void> {
  await deleteCart();
}
