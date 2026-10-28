
import cartAxiosInstance from "./cartAxiosInstance";

const GUEST_CART_TOKEN_KEY = "aaplaDabba_guestCartToken";

export interface CartItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name?: string;
  description?: string;
  categoryName?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
  currencyCode?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface CartResponse {
  cartId: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  items: CartItem[];
  status?: string;
  subtotal: number;
  totalQuantity: number;
  updatedAtUtc?: string | null;
  [key: string]: unknown;
}

interface AddCartResponse {
  cartId?: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  [key: string]: unknown;
}

function getResponseData<T>(responseData: T | { data: T }): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    responseData.data !== null
  ) {
    return responseData.data as T;
  }

  return responseData as T;
}

export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

function saveGuestCartToken(token: string): void {
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

export async function createCart(): Promise<AddCartResponse> {
  const response = await cartAxiosInstance.post("/AddCart");
  const data = getResponseData<AddCartResponse>(response.data);

  if (!data.guestCartToken) {
    throw new Error(
      "Cart API did not return guestCartToken. Check the AddCart response."
    );
  }

  saveGuestCartToken(data.guestCartToken);

  return data;
}

export async function ensureGuestCartToken(): Promise<string> {
  const existingToken = getGuestCartToken();

  if (existingToken) {
    return existingToken;
  }

  const cart = await createCart();
  return cart.guestCartToken as string;
}

export async function getCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<CartResponse>(response.data);
}

export async function getCartItemById(
  cartItemId: string
): Promise<CartItem> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get(
    `/GetCartItemById/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getResponseData<CartItem>(response.data);
}

export async function addCartItem(
  input: CartItemRequest
): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.post(
    "/AddCartItem",
    {
      menuItemId: input.menuItemId,
      quantity: input.quantity,
    },
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

export async function updateCartItemQty(
  cartItemId: string,
  quantity: number
): Promise<CartResponse> {
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

  return getCart();
}

export async function removeCartItem(
  cartItemId: string
): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItem/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

export async function removeCartItemByMenuItemId(
  menuItemId: string
): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItemById/${encodeURIComponent(menuItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

export async function validateCart(): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/ValidateCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<unknown>(response.data);
}

export async function deleteCart(): Promise<void> {
  const token = await ensureGuestCartToken();

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
